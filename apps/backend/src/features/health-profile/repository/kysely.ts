import { Option, Effect, Layer } from 'effect'
import { KyselyClient } from '@/features/database/kysely'
import { HealthProfileRepository } from './interface'
import { HealthProfileRepositoryError } from './error'

export const KyselyHealthProfileRepositoryLive = Layer.effect(
  HealthProfileRepository,
  Effect.gen(function* () {
    const db = yield* KyselyClient

    return HealthProfileRepository.of({
      create: (payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .insertInto('health_profiles')
              .values(payload)
              .returningAll()
              .executeTakeFirstOrThrow(),
          catch: (error) =>
            new HealthProfileRepositoryError({
              message: 'Failed to create health profile',
              cause: error
            })
        }),

      findById: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('health_profiles')
              .selectAll()
              .where('id', '=', id)
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new HealthProfileRepositoryError({
              message: `Failed to find health profile by id: ${id}`,
              cause: error
            })
        }),

      findByUserId: (userId) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('health_profiles')
              .selectAll()
              .where('user_id', '=', userId)
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new HealthProfileRepositoryError({
              message: `Failed to find health profile by user id ${userId}`,
              cause: error
            })
        }),

      update: (id, payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .updateTable('health_profiles')
              .set(payload)
              .where('id', '=', id)
              .returningAll()
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new HealthProfileRepositoryError({
              message: `Failed to update health profile by id: ${id}`,
              cause: error
            })
        }),

      delete: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .deleteFrom('health_profiles')
              .where('id', '=', id)
              .returningAll()
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new HealthProfileRepositoryError({
              message: `Failed to delete health profile by id: ${id}`,
              cause: error
            })
        })
    })
  })
)
