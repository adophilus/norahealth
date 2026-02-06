import { Effect, Option } from 'effect'
import { UserService } from '../service/interface'
import { StorageService } from '@/features/storage'
import { HealthProfileService } from '@/features/health-profile'
import { FullUser } from '@nora-health/domain'

export const getProfileUseCase = (userId: string) =>
  Effect.gen(function* () {
    const userService = yield* UserService
    const storageService = yield* StorageService
    const healthProfileService = yield* HealthProfileService

    const user = yield* userService.findById(userId)
    const healthProfile = yield* healthProfileService.findByUserId(userId)

    const profilePicture = yield* Effect.succeed(
      Option.fromNullable(user.profile_picture_id)
    ).pipe(
      Effect.map(
        Option.map((id) =>
          storageService
            .get(id)
            .pipe(Effect.map(storageService.convertToMediaDescription))
        )
      ),
      Effect.flatMap(Option.getOrElse(() => Effect.succeed(null))),
      Effect.catchTag('StorageServiceNotFoundError', () => Effect.succeed(null))
    )

    return FullUser.make({
      ...user,
      profile_picture: profilePicture,
      health_profile: healthProfile
    })
  })
