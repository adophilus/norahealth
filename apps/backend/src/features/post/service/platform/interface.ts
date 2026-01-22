import { Context, type Effect } from 'effect'
import type { PostPlatform as TPostPlatform } from '@/types'
import type {
  PostPlatformServiceError,
  PostPlatformServiceNotFoundError
} from './error'
import type { PostPlatform } from '@nora-health/domain'

export class PostPlatformService extends Context.Tag('PostPlatformService')<
  PostPlatformService,
  {
    create: (
      payload: TPostPlatform.Insertable
    ) => Effect.Effect<PostPlatform, PostPlatformServiceError>

    findById: (
      id: string
    ) => Effect.Effect<
      PostPlatform,
      PostPlatformServiceNotFoundError | PostPlatformServiceError
    >

    findByPostId: (
      postId: string
    ) => Effect.Effect<PostPlatform[], PostPlatformServiceError>

    update: (
      id: string,
      payload: Omit<
        TPostPlatform.Updateable,
        'id' | 'created_at' | 'updated_at' | 'post_id'
      >
    ) => Effect.Effect<
      PostPlatform,
      PostPlatformServiceNotFoundError | PostPlatformServiceError
    >

    delete: (
      id: string
    ) => Effect.Effect<
      void,
      PostPlatformServiceNotFoundError | PostPlatformServiceError
    >
  }
>() {}
