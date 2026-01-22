import { Effect, Layer } from 'effect'
import { KyselyClient } from '@/features/database/kysely'
import { WaitlistRepository } from './interface'
import { WaitlistRepositoryError } from './error'
import { ulid } from 'ulidx'

export const KyselyWaitlistRepositoryLive = Layer.effect(
  WaitlistRepository,
  Effect.gen(function* () {
    const db = yield* KyselyClient

    return WaitlistRepository.of({
      create: (entry) =>
        Effect.tryPromise({
          try: async () =>
            db
              .insertInto('waitlist_entries')
              .values({ ...entry, id: ulid() })
              .returningAll()
              .executeTakeFirstOrThrow(),
          catch: (error) =>
            new WaitlistRepositoryError({
              message: String(error),
              cause: error
            })
        }),

      findByEmail: (email) =>
        Effect.tryPromise({
          try: async () =>
            db
              .selectFrom('waitlist_entries')
              .selectAll()
              .where('email', '=', email)
              .executeTakeFirst()
              .then((res) => res ?? null),
          catch: (error) =>
            new WaitlistRepositoryError({
              message: String(error),
              cause: error
            })
        })
    })
  })
)
