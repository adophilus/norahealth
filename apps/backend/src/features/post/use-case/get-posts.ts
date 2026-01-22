import { Effect } from 'effect'
import { PostService } from '../service/post'
import { PostPlatformService } from '../service/platform'
import { PostWithPlatforms } from '@nora-health/domain'

export const getPostsUseCase = (userId: string) =>
  Effect.gen(function* () {
    const postService = yield* PostService
    const postPlatformService = yield* PostPlatformService

    const posts = yield* postService.findByUserId(userId)

    return yield* Effect.forEach(
      posts,
      (post) =>
        Effect.gen(function* () {
          const platforms = yield* postPlatformService.findByPostId(post.id)
          const platformsMap = platforms.reduce(
            (acc, platform) => ({
              ...acc,
              [platform.platform]: platform
            }),
            {}
          )
          return PostWithPlatforms.make({
            ...post,
            platforms: platformsMap
          })
        }),
      { concurrency: 'inherit' }
    )
  })
