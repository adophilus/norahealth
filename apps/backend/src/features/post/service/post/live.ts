import { Effect, Layer, Option } from 'effect'
import { PostService } from './interface'
import { PostServiceError, PostServiceNotFoundError } from './error'
import { PostRepository } from '../../repository'
import { Post } from '@nora-health/domain'

export const PostServiceLive = Layer.effect(
  PostService,
  Effect.gen(function* () {
    const postRepository = yield* PostRepository

    return PostService.of({
      create: (payload) =>
        postRepository
          .create({
            ...payload,
            media_ids: JSON.stringify(payload.media_ids)
          })
          .pipe(
            Effect.map((post) =>
              Post.make({
                ...post,
                media_ids: JSON.parse(post.media_ids) as string[]
              })
            ),
            Effect.catchTags({
              PostRepositoryError: (error) =>
                new PostServiceError({ message: error.message, cause: error })
            })
          ),

      findById: (id) =>
        postRepository.findById(id).pipe(
          Effect.flatMap(
            Option.match({
              onSome: (post) =>
                Effect.succeed(
                  Post.make({
                    ...post,
                    media_ids: JSON.parse(post.media_ids) as string[]
                  })
                ),
              onNone: () => Effect.fail(new PostServiceNotFoundError({}))
            })
          ),
          Effect.catchTags({
            PostRepositoryError: (error) =>
              new PostServiceError({ message: error.message, cause: error })
          })
        ),

      findByUserId: (userId) =>
        postRepository.findByUserId(userId).pipe(
          Effect.map((posts) =>
            posts.map((post) =>
              Post.make({
                ...post,
                media_ids: JSON.parse(post.media_ids) as string[]
              })
            )
          ),
          Effect.catchTags({
            PostRepositoryError: (error) =>
              new PostServiceError({ message: error.message, cause: error })
          })
        ),

      update: (id, payload) => {
        return postRepository
          .update(id, {
            ...payload,
            media_ids: payload.media_ids
              ? JSON.stringify(payload.media_ids)
              : undefined
          })
          .pipe(
            Effect.flatMap(
              Option.match({
                onSome: (post) =>
                  Effect.succeed(
                    Post.make({
                      ...post,
                      media_ids: JSON.parse(post.media_ids) as string[]
                    })
                  ),
                onNone: () => Effect.fail(new PostServiceNotFoundError({}))
              })
            ),
            Effect.catchTags({
              PostRepositoryError: (error) =>
                new PostServiceError({ message: error.message, cause: error })
            })
          )
      },

      delete: (id) =>
        postRepository.delete(id).pipe(
          Effect.flatMap(
            Option.match({
              onSome: () => Effect.void,
              onNone: () => Effect.fail(new PostServiceNotFoundError({}))
            })
          ),
          Effect.catchTags({
            PostRepositoryError: (error) =>
              new PostServiceError({ message: error.message, cause: error })
          })
        )
    })
  })
)
