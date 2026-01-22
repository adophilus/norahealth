import { getUnixTime } from 'date-fns'
import { Effect, Layer, Option } from 'effect'
import { KyselyClient } from '@/features/database/kysely'
import {
  ConnectedAccountNotFoundError,
  ConnectedAccountRepositoryError
} from './error'
import { ConnectedAccountRepository } from './interface'

export const ConnectedAccountRepositoryLive = Layer.effect(
  ConnectedAccountRepository,
  Effect.gen(function* () {
    const db = yield* KyselyClient

    return ConnectedAccountRepository.of({
      create: (payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .insertInto('connected_accounts')
              .values(payload)
              .returningAll()
              .executeTakeFirstOrThrow(),
          catch: (error) =>
            new ConnectedAccountRepositoryError({
              message: `Failed to create connected account: ${String(error)}`,
              cause: error
            })
        }),

      findByUserId: (userId) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('connected_accounts')
              .selectAll()
              .where('user_id', '=', userId)
              .orderBy('created_at', 'desc')
              .execute(),
          catch: (error) =>
            new ConnectedAccountRepositoryError({
              message: `Failed to find connected accounts for user: ${String(error)}`,
              cause: error
            })
        }),

      findById: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('connected_accounts')
              .selectAll()
              .where('id', '=', id)
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new ConnectedAccountRepositoryError({
              message: `Failed to find connected account by ID: ${String(error)}`,
              cause: error
            })
        }),

      findByUserIdAndPlatform: (userId, platform) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('connected_accounts')
              .selectAll()
              .where('user_id', '=', userId)
              .where('platform', '=', platform)
              .where('is_active', '=', true)
              .executeTakeFirst(),
          catch: (error) =>
            new ConnectedAccountRepositoryError({
              message: `Failed to find connected account: ${String(error)}`,
              cause: error
            })
        }).pipe(Effect.map(Option.fromNullable)),

      update: (id, payload) =>
        Effect.tryPromise({
          try: async () => {
            const result = await db
              .updateTable('connected_accounts')
              .set({
                ...payload,
                updated_at: getUnixTime(new Date())
              })
              .where('id', '=', id)
              .returningAll()
              .executeTakeFirst()

            if (!result) {
              throw new Error('Connected account not found')
            }

            return result
          },
          catch: (error) => {
            if (
              error instanceof Error &&
              error.message === 'Connected account not found'
            ) {
              return new ConnectedAccountNotFoundError({
                message: 'Connected account not found'
              })
            }

            return new ConnectedAccountRepositoryError({
              message: `Failed to update connected account: ${String(error)}`,
              cause: error
            })
          }
        }),

      softDelete: (id) =>
        Effect.tryPromise({
          try: async () => {
            const result = await db
              .updateTable('connected_accounts')
              .set({
                is_active: false,
                disconnected_at: getUnixTime(new Date())
              })
              .where('id', '=', id)
              .returningAll()
              .executeTakeFirst()

            if (!result) {
              throw new Error('Connected account not found')
            }

            return undefined
          },
          catch: (error) => {
            if (
              error instanceof Error &&
              error.message === 'Connected account not found'
            ) {
              return new ConnectedAccountNotFoundError({
                message: 'Connected account not found'
              })
            }

            return new ConnectedAccountRepositoryError({
              message: `Failed to disconnect account: ${String(error)}`,
              cause: error
            })
          }
        })
    })
  })
)
