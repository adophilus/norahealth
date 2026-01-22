import { Effect, Option } from 'effect'
import { UserService } from '../service/interface'
import { UserWithProfile } from '@nora-health/api/common'
import { StorageService } from '@/features/storage'
import type { MediaDescription } from '@nora-health/domain'

export const getProfileUseCase = (userId: string) =>
  Effect.gen(function*() {
    const userService = yield* UserService
    const storageService = yield* StorageService

    const user = yield* userService.findById(userId)

    let profilePicture: MediaDescription | null = null
    if (user.profile_picture_id) {
      profilePicture = yield* storageService.get(user.profile_picture_id).pipe(
        Effect.map(storageService.convertToMediaDescription),
        Effect.catchTag('StorageServiceNotFoundError', () =>
          Effect.succeed(null)
        )
      )
    }

    return UserWithProfile.make({
      ...user,
      profile_picture: profilePicture
    })
  })
