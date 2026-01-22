import { Effect, Layer, Option } from 'effect'
import { PostPlatformService } from './interface'
import {
  PostPlatformServiceError,
  PostPlatformServiceNotFoundError
} from './error'
import { PostPlatformRepository } from '../../repository'
import { PostPlatform } from '@nora-health/domain'
import { ulid } from 'ulidx'

export const PostPlatformServiceLive = Layer.effect(
  PostPlatformService,
  Effect.gen(function* () {
    const postPlatformRepository = yield* PostPlatformRepository

    return PostPlatformService.of({
      create: (payload) =>
        postPlatformRepository
          .create({
            ...payload,
            id: ulid()
          })
          .pipe(
            Effect.map((platform) => PostPlatform.make(platform)),
            Effect.catchTags({
              PostPlatformRepositoryError: (error) =>
                new PostPlatformServiceError({
                  message: error.message,
                  cause: error
                })
            })
          ),

      findById: (id) =>
        postPlatformRepository.findById(id).pipe(
          Effect.flatMap(
            Option.match({
              onSome: (platform) => Effect.succeed(PostPlatform.make(platform)),
              onNone: () =>
                Effect.fail(new PostPlatformServiceNotFoundError({}))
            })
          ),
          Effect.catchTags({
            PostPlatformRepositoryError: (error) =>
              new PostPlatformServiceError({
                message: error.message,
                cause: error
              })
          })
        ),

      findByPostId: (postId) =>
        postPlatformRepository.findByPostId(postId).pipe(
          Effect.map((platforms) =>
            platforms.map((platform) => PostPlatform.make(platform))
          ),
          Effect.catchTags({
            PostPlatformRepositoryError: (error) =>
              new PostPlatformServiceError({
                message: error.message,
                cause: error
              })
          })
        ),

      update: (id, payload) =>
        postPlatformRepository.updateById(id, payload).pipe(
          Effect.flatMap(
            Option.match({
              onSome: (platform) => Effect.succeed(PostPlatform.make(platform)),
              onNone: () =>
                Effect.fail(new PostPlatformServiceNotFoundError({}))
            })
          ),
          Effect.catchTags({
            PostPlatformRepositoryError: (error) =>
              new PostPlatformServiceError({
                message: error.message,
                cause: error
              })
          })
        ),

      delete: (id) =>
        postPlatformRepository.deleteById(id).pipe(
          Effect.flatMap(
            Option.match({
              onSome: () => Effect.void,
              onNone: () =>
                Effect.fail(new PostPlatformServiceNotFoundError({}))
            })
          ),
          Effect.catchTags({
            PostPlatformRepositoryError: (error) =>
              new PostPlatformServiceError({
                message: error.message,
                cause: error
              })
          })
        )
    })
  })
)
