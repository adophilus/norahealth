import { Effect } from 'effect'
import { PostService } from '../service/post'
import { PostPlatformService } from '../service/platform'
import { PostWithPlatforms } from '@nora-health/domain'

export const getPostUseCase = (id: string) =>
  Effect.gen(function* () {
    const postService = yield* PostService
    const postPlatformService = yield* PostPlatformService

    const post = yield* postService.findById(id)
    const platforms = yield* postPlatformService.findByPostId(id)

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
  })
