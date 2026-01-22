import { Effect, Layer, Option } from 'effect'
import { KyselyClient } from '@/features/database/kysely'
import { AuthSessionRepository } from './interface'
import { AuthSessionRepositoryError } from './error'
import { getUnixTime } from 'date-fns'

export const KyselyAuthSessionRepositoryLive = Layer.effect(
  AuthSessionRepository,
  Effect.gen(function* () {
    const db = yield* KyselyClient

    return AuthSessionRepository.of({
      create: (
        payload // payload is already AuthSession.Insertable based on the AuthSession class
      ) =>
        Effect.tryPromise({
          try: () =>
            db
              .insertInto('auth_sessions')
              .values(payload) // Directly use payload as it's correctly typed now
              .returningAll()
              .executeTakeFirstOrThrow(),
          catch: (error) =>
            new AuthSessionRepositoryError({
              message: `Failed to create session: ${String(error)}`,
              cause: error
            })
        }),

      findById: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('auth_sessions')
              .selectAll()
              .where('id', '=', id)
              .executeTakeFirst(),
          catch: (error) =>
            new AuthSessionRepositoryError({
              message: `Failed to find session by ID: ${String(error)}`,
              cause: error
            })
        }).pipe(Effect.map(Option.fromNullable)),

      updateById: (id, payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .updateTable('auth_sessions')
              .set({
                ...payload,
                updated_at: getUnixTime(new Date())
              })
              .where('id', '=', id)
              .returningAll()
              .executeTakeFirstOrThrow(),
          catch: (error) =>
            new AuthSessionRepositoryError({
              message: `Failed to update session by token: ${String(error)}`,
              cause: error
            })
        }),

      deleteById: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .deleteFrom('auth_sessions')
              .where('id', '=', id)
              .executeTakeFirst(),
          catch: (error) =>
            new AuthSessionRepositoryError({
              message: `Failed to delete session by token: ${String(error)}`,
              cause: error
            })
        }),

      deleteAllExpired: () =>
        Effect.tryPromise({
          try: () => {
            const currentTime = getUnixTime(new Date())
            return db
              .deleteFrom('auth_sessions')
              .where('expires_at', '<', currentTime) // Changed from refresh_token_expires_at
              .execute()
          },
          catch: (error) =>
            new AuthSessionRepositoryError({
              message: `Failed to delete expired sessions: ${String(error)}`,
              cause: error
            })
        })
    })
  })
)
