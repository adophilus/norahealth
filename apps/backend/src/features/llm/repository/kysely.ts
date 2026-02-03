import { Effect, Layer, Option } from 'effect'
import { ulid } from 'ulidx'
import { KyselyClient } from '@/features/database/kysely'
import {
  AgentConversationRepositoryError,
  AgentConversationRepositoryNotFoundError
} from './error'
import { AgentConversationRepository } from './interface'

export const KyselyAgentConversationRepositoryLive = Layer.effect(
  AgentConversationRepository,
  Effect.gen(function* () {
    const db = yield* KyselyClient

    return AgentConversationRepository.of({
      create: (payload) =>
        Effect.gen(function* () {
          const conversation = yield* Effect.tryPromise({
            try: () =>
              db
                .insertInto('agent_conversations')
                .values({
                  id: ulid(),
                  user_id: payload.user_id,
                  agent_type: payload.agent_type as any,
                  messages: payload.messages,
                  context: payload.context,
                  created_at: Date.now(),
                  updated_at: null
                } as any)
                .returningAll()
                .executeTakeFirstOrThrow(),
            catch: (error) =>
              new AgentConversationRepositoryError({
                message: `Failed to create conversation: ${String(error)}`,
                cause: error
              })
          })

          return conversation
        }),

      findById: (id) =>
        Effect.gen(function* () {
          const result = yield* Effect.tryPromise({
            try: () =>
              db
                .selectFrom('agent_conversations')
                .where('id', '=', id)
                .selectAll()
                .executeTakeFirst(),
            catch: (error) =>
              new AgentConversationRepositoryError({
                message: `Failed to find conversation by ID: ${String(error)}`,
                cause: error
              })
          })

          return Option.fromNullable(result)
        }),

      findByUserId: (userId, agentType) =>
        Effect.gen(function* () {
          let query = db
            .selectFrom('agent_conversations')
            .where('user_id', '=', userId)

          if (agentType) {
            query = query.where('agent_type', '=', agentType as any)
          }

          const conversations = yield* Effect.tryPromise({
            try: () => query.selectAll().execute(),
            catch: (error) =>
              new AgentConversationRepositoryError({
                message: `Failed to find conversations by user ID: ${String(error)}`,
                cause: error
              })
          })

          return conversations
        }),

      updateById: (id, payload) =>
        Effect.gen(function* () {
          const conversation = yield* Effect.tryPromise({
            try: () =>
              db
                .updateTable('agent_conversations')
                .set({
                  ...payload,
                  updated_at: Date.now()
                })
                .where('id', '=', id)
                .returningAll()
                .executeTakeFirstOrThrow(),
            catch: (error) =>
              new AgentConversationRepositoryError({
                message: `Failed to update conversation: ${String(error)}`,
                cause: error
              })
          })

          return conversation
        }),

      deleteById: (id) =>
        Effect.gen(function* () {
          const res = yield* Effect.tryPromise({
            try: () =>
              db
                .deleteFrom('agent_conversations')
                .where('id', '=', id)
                .executeTakeFirst(),
            catch: (error) =>
              new AgentConversationRepositoryError({
                message: `Failed to delete conversation: ${String(error)}`,
                cause: error
              })
          })

          if (res.numDeletedRows === 0n)
            return yield* new AgentConversationRepositoryNotFoundError({
              message: `Conversation with ID ${id} not found`
            })
        })
    })
  })
)
