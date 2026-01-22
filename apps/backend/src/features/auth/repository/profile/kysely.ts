import { getUnixTime } from 'date-fns'
import { Effect, Layer, Option } from 'effect'
import { sql } from 'kysely'
import { ulid } from 'ulidx'
import { KyselyClient } from '@/features/database/kysely'
import { AuthProfileRepositoryError } from './error'
import { AuthProfileRepository } from './interface'

export const KyselyAuthProfileRepositoryLive = Layer.effect(
  AuthProfileRepository,
  Effect.gen(function* () {
    const db = yield* KyselyClient

    return AuthProfileRepository.of({
      create: (payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .insertInto('auth_profiles')
              .values({
                ...payload,
                id: ulid()
              })
              .returningAll()
              .executeTakeFirstOrThrow(),
          catch: (error) =>
            new AuthProfileRepositoryError({
              message: `Failed to create auth profile: ${String(error)}`,
              cause: error
            })
        }),

      findById: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('auth_profiles')
              .selectAll()
              .where('id', '=', id)
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new AuthProfileRepositoryError({
              message: `Failed to find auth profile by ID: ${String(error)}`,
              cause: error
            })
        }),

      findByUserId: (user_id) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('auth_profiles')
              .selectAll()
              .where('user_id', '=', user_id)
              .execute(),
          catch: (error) =>
            new AuthProfileRepositoryError({
              message: `Failed to find auth profiles by user ID: ${String(error)}`,
              cause: error
            })
        }),

      findByEmail: (email) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('auth_profiles')
              .selectAll()
              .where(sql`json_extract(meta, '$.key')`, '=', 'EMAIL')
              .where(sql`json_extract(meta, '$.email')`, '=', email)
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new AuthProfileRepositoryError({
              message: `Failed to find auth profile by email: ${String(error)}`,
              cause: error
            })
        }),

      findByFarcasterFid: (fid) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('auth_profiles')
              .selectAll()
              .where(sql`json_extract(meta, '$.key')`, '=', 'FARCASTER')
              .where(sql`json_extract(meta, '$.fid')`, '=', fid)
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new AuthProfileRepositoryError({
              message: `Failed to find auth profile by Farcaster FID: ${String(error)}`,
              cause: error
            })
        }),

      updateById: (id, payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .updateTable('auth_profiles')
              .set({
                ...payload,
                updated_at: getUnixTime(new Date())
              })
              .where('id', '=', id)
              .returningAll()
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new AuthProfileRepositoryError({
              message: `Failed to update auth profile by ID: ${String(error)}`,
              cause: error
            })
        }),

      deleteById: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .deleteFrom('auth_profiles')
              .where('id', '=', id)
              .returningAll()
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new AuthProfileRepositoryError({
              message: `Failed to delete auth profile by ID: ${String(error)}`,
              cause: error
            })
        })
    })
  })
)
