import { Effect } from 'effect'
import { PostService } from '../service'

export const deletePostUseCase = (id: string) =>
  Effect.gen(function* () {
    const postService = yield* PostService
    return yield* postService.delete(id)
  })
