import { Effect } from 'effect'
import { PostService } from '../service'
import type { Post } from '@/types'

export const updatePostUseCase = (
  id: string,
  payload: Omit<
    Post.Updateable,
    'id' | 'created_at' | 'updated_at' | 'user_id' | 'media_ids'
  > & { media_ids?: readonly string[] }
) =>
  Effect.gen(function* () {
    const postService = yield* PostService
    return yield* postService.update(id, payload)
  })
