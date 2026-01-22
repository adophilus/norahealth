import { Effect } from 'effect'
import { UserService } from '../service/interface'

export const fetchUserProfileByIdUseCase = (userId: string) =>
  Effect.gen(function* () {
    const userService = yield* UserService

    const user = yield* userService.findById(userId)

    return user
  })
