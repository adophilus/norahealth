import { Effect, Layer, Option } from 'effect'
import { KyselyClient } from '@/features/database/kysely'
import { PostPlatformRepository } from './interface'
import { PostPlatformRepositoryError } from './error'
import { getUnixTime } from 'date-fns'

export const KyselyPostPlatformRepositoryLive = Layer.effect(
  PostPlatformRepository,
  Effect.gen(function* () {
    const db = yield* KyselyClient

    return PostPlatformRepository.of({
      create: (payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .insertInto('post_platform')
              .values(payload)
              .returningAll()
              .executeTakeFirstOrThrow(),
          catch: (error) =>
            new PostPlatformRepositoryError({
              message: `Failed to add platform to post: ${String(error)}`,
              cause: error
            })
        }),

      findById: (id) =>
        Effect.tryPromise({
          try: async () => {
            const platform = await db
              .selectFrom('post_platform')
              .selectAll()
              .where('id', '=', id)
              .executeTakeFirst()
            return Option.fromNullable(platform)
          },
          catch: (error) =>
            new PostPlatformRepositoryError({
              message: `Failed to find post platform by ID: ${String(error)}`,
              cause: error
            })
        }),

      findByPostId: (postId) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('post_platform')
              .selectAll()
              .where('post_id', '=', postId)
              .execute(),
          catch: (error) =>
            new PostPlatformRepositoryError({
              message: `Failed to find post platforms by post ID: ${String(
                error
              )}`,
              cause: error
            })
        }),

      updateById: (id, payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .updateTable('post_platform')
              .set({ ...payload, updated_at: getUnixTime(new Date()) })
              .where('id', '=', id)
              .returningAll()
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new PostPlatformRepositoryError({
              message: `Failed to update post platform status: ${String(error)}`,
              cause: error
            })
        }),

      deleteById: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .deleteFrom('post_platform')
              .where('id', '=', id)
              .returningAll()
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new PostPlatformRepositoryError({
              message: `Failed to delete post platform: ${String(error)}`,
              cause: error
            })
        })
    })
  })
)
