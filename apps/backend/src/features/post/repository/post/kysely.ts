import { Effect, Layer, Option } from 'effect'
import { KyselyClient } from '@/features/database/kysely'
import { PostRepository } from './interface'
import { PostRepositoryError } from './error'
import { getUnixTime } from 'date-fns'

export const KyselyPostRepositoryLive = Layer.effect(
  PostRepository,
  Effect.gen(function* () {
    const db = yield* KyselyClient

    return PostRepository.of({
      create: (payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .insertInto('posts')
              .values(payload)
              .returningAll()
              .executeTakeFirstOrThrow(),
          catch: (error) =>
            new PostRepositoryError({
              message: `Failed to create post: ${String(error)}`,
              cause: error
            })
        }),

      findById: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('posts')
              .selectAll()
              .where('id', '=', id)
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new PostRepositoryError({
              message: `Failed to find post by ID: ${String(error)}`,
              cause: error
            })
        }),

      findByUserId: (userId) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('posts')
              .selectAll()
              .where('user_id', '=', userId)
              .execute(),
          catch: (error) =>
            new PostRepositoryError({
              message: `Failed to find posts by user ID: ${String(error)}`,
              cause: error
            })
        }),

      update: (id, data) =>
        Effect.tryPromise({
          try: () =>
            db
              .updateTable('posts')
              .set({
                ...data,
                updated_at: getUnixTime(new Date())
              })
              .where('id', '=', id)
              .returningAll()
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new PostRepositoryError({
              message: `Failed to update post: ${String(error)}`,
              cause: error
            })
        }),

      delete: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .deleteFrom('posts')
              .where('id', '=', id)
              .returningAll()
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new PostRepositoryError({
              message: `Failed to delete post: ${String(error)}`,
              cause: error
            })
        })
    })
  })
)
