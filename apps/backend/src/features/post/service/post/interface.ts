import { Context, type Effect } from 'effect'
import type { Post as TPost } from '@/types'
import type { PostServiceError, PostServiceNotFoundError } from './error'
import type { Post } from '@nora-health/domain'

export class PostService extends Context.Tag('PostService')<
  PostService,
  {
    create: (
      payload: Omit<TPost.Insertable, 'media_ids'> & {
        media_ids: readonly string[]
      }
    ) => Effect.Effect<Post, PostServiceError>

    findById: (
      id: string
    ) => Effect.Effect<Post, PostServiceNotFoundError | PostServiceError>

    findByUserId: (userId: string) => Effect.Effect<Post[], PostServiceError>

    update: (
      id: string,
      payload: Omit<
        TPost.Updateable,
        'id' | 'created_at' | 'updated_at' | 'user_id' | 'media_ids'
      > & { media_ids?: readonly string[] }
    ) => Effect.Effect<Post, PostServiceNotFoundError | PostServiceError>

    delete: (
      id: string
    ) => Effect.Effect<void, PostServiceNotFoundError | PostServiceError>
  }
>() {}
