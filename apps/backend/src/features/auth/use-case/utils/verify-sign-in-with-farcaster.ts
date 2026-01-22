import { Effect } from 'effect'
import type { User } from '@nora-health/api/common'
import { ulid } from 'ulidx'
import { getUnixTime } from 'date-fns'
import { AuthProfileService, AuthSessionService } from '../../service'
import { UserService } from '@/features/user'
import type { VerifiedDetails } from '@/features/farcaster'

export const verifySignInWithFarcaster = (details: VerifiedDetails) =>
  Effect.gen(function* () {
    const authProfileService = yield* AuthProfileService
    const authSessionService = yield* AuthSessionService
    const userService = yield* UserService

    const existingAuthProfile = yield* authProfileService
      .findByFarcasterFid(details.fid.toString())
      .pipe(
        Effect.catchTag('AuthProfileServiceNotFoundError', () =>
          Effect.succeed(null)
        )
      )

    let user: User

    if (existingAuthProfile) {
      user = yield* userService.findById(existingAuthProfile.user_id)
    } else {
      user = yield* userService.create({
        id: ulid(),
        email: null,
        status: 'VERIFIED',
        verified_at: getUnixTime(new Date()),
        role: 'USER',
        profile_picture_id: null,
        deleted_at: null
      })

      yield* authProfileService.create({
        id: ulid(),
        meta: {
          key: 'FARCASTER',
          fid: details.fid.toString()
        },
        user_id: user.id
      })
    }

    const session = yield* authSessionService.create(user.id)

    return { user, session }
  })
