import { Effect, Layer, Option } from 'effect'
import { UserRepository } from './interface'
import { UserRepositoryError } from './error'
import { getUnixTime } from 'date-fns'
import { KyselyClient } from '@/features/database/kysely'

export const KyselyUserRepositoryLive = Layer.effect(
  UserRepository,
  Effect.gen(function* (_) {
    const db = yield* KyselyClient

    return UserRepository.of({
      // TODO: implement proper checks in order to return the UserRepositoryEmailAlreadyInUseError and UserRepositoryPhoneNumberAlreadyInUseError
      create: (payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .insertInto('users')
              .values(payload)
              .returningAll()
              .executeTakeFirstOrThrow(),
          catch: (error) =>
            new UserRepositoryError({
              message: `Failed to create user: ${String(error)}`,
              cause: error
            })
        }),

      findById: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('users')
              .selectAll()
              .where('id', '=', id)
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new UserRepositoryError({
              message: `Failed to find user by ID: ${String(error)}`,
              cause: error
            })
        }),

      findByEmail: (email) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('users')
              .selectAll()
              .where('email', '=', email)
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new UserRepositoryError({
              message: `Failed to find user by email: ${String(error)}`,
              cause: error
            })
        }),

      updateById: (id, payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .updateTable('users')
              .set({
                ...payload,
                updated_at: getUnixTime(new Date())
              })
              .where('id', '=', id)
              .returningAll()
              .executeTakeFirstOrThrow(),
          catch: (error) =>
            new UserRepositoryError({
              message: `Failed to update user by ID: ${String(error)}`,
              cause: error
            })
        }),

      deleteById: (id) =>
        Effect.tryPromise({
          try: () =>
            db.deleteFrom('users').where('id', '=', id).executeTakeFirst(),
          catch: (error) =>
            new UserRepositoryError({
              message: `Failed to delete user by ID: ${String(error)}`,
              cause: error
            })
        })
    })
  })
)
