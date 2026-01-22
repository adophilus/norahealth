import { Effect } from 'effect'
import { UserService } from '../service/interface'
import type { UpdateUserProfileRequestBody } from '@nora-health/api/User/UpdateUserProfileEndpoint'

export const updateUserProfileUseCase = (
  userId: string,
  payload: UpdateUserProfileRequestBody
) =>
  Effect.gen(function* () {
    const userService = yield* UserService

    const updatedUser = yield* userService.updateById(userId, payload)

    return updatedUser
  })
