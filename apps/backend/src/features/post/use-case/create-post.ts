import { Effect } from 'effect'
import { PostService } from '../service/post'
import { PostPlatformService } from '../service/platform'
import { PostWithPlatforms, type User } from '@nora-health/domain'
import { ulid } from 'ulidx'
import type { CreatePostRequestBody } from '@nora-health/api/Post/CreatePostEndpoint'

export const createPostUseCase = (
  payload: CreatePostRequestBody,
  actor: User
) =>
  Effect.gen(function* () {
    const postService = yield* PostService
    const postPlatformService = yield* PostPlatformService

    const post = yield* postService.create({
      ...payload,
      user_id: actor.id,
      status: 'DRAFT',
      id: ulid()
    })

    const platforms = yield* Effect.forEach(
      payload.platforms,
      (platformName) =>
        postPlatformService.create({
          id: ulid(),
          post_id: post.id,
          platform: platformName,
          status: 'DRAFT'
        }),
      { concurrency: 'inherit' }
    )

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
