import { getUnixTime } from 'date-fns'
import { Effect, Layer, Option } from 'effect'
import { KyselyClient } from '@/features/database/kysely'
import { NeynarSignerRepositoryError } from './error'
import { NeynarSignerRepository } from './interface'

export const KyselyNeynarSignerRepositoryLive = Layer.effect(
  NeynarSignerRepository,
  Effect.gen(function* () {
    const db = yield* KyselyClient

    return NeynarSignerRepository.of({
      findById: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('neynar_signers')
              .selectAll()
              .where('id', '=', id)
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new NeynarSignerRepositoryError({
              message: `Failed to find neynar signer by ID: ${String(error)}`,
              cause: error
            })
        }),

      findBySignerUuid: (signer_uuid) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('neynar_signers')
              .selectAll()
              .where('signer_uuid', '=', signer_uuid)
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new NeynarSignerRepositoryError({
              message: `Failed to find neynar signer by UUID: ${String(error)}`,
              cause: error
            })
        }),

      findByFid: (fid) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('neynar_signers')
              .selectAll()
              .where('fid', '=', fid)
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new NeynarSignerRepositoryError({
              message: `Failed to find neynar signer by FID: ${String(error)}`,
              cause: error
            })
        }),

      create: (payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .insertInto('neynar_signers')
              .values(payload)
              .returningAll()
              .executeTakeFirstOrThrow(),
          catch: (error) =>
            new NeynarSignerRepositoryError({
              message: `Failed to create neynar signer: ${String(error)}`,
              cause: error
            })
        }),

      updateById: (id, payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .updateTable('neynar_signers')
              .set({ ...payload, updated_at: getUnixTime(new Date()) })
              .where('id', '=', id)
              .returningAll()
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new NeynarSignerRepositoryError({
              message: `Failed to update neynar signer: ${String(error)}`,
              cause: error
            })
        }),

      deleteById: (id) =>
        Effect.tryPromise({
          try: () =>
            db.deleteFrom('neynar_signers').where('id', '=', id).execute(),
          catch: (error) =>
            new NeynarSignerRepositoryError({
              message: `Failed to soft delete neynar signer: ${String(error)}`,
              cause: error
            })
        })
    })
  })
)
