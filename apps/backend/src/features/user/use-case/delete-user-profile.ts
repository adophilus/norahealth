import { Effect } from 'effect'
import { UserService } from '../service/interface'

export const deleteUserProfileUseCase = (userId: string) =>
  Effect.gen(function* () {
    const userService = yield* UserService

    yield* userService.deleteById(userId)
  })
