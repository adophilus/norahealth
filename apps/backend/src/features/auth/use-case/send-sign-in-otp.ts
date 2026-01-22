import { Effect } from 'effect'
import type { SendSignInOtpRequestBody } from '@nora-health/api/Auth/SendSignInOtpEndpoint'
import { UserService } from '@/features/user'
import { ulid } from 'ulidx'
import { AuthProfileService, AuthTokenService } from '../service'
import { Mailer } from '@/features/mailer'
import { WelcomeMail } from '@/emails'

export const sendSignInOtpUseCase = (payload: SendSignInOtpRequestBody) =>
  Effect.gen(function* () {
    const userService = yield* UserService
    const authTokenService = yield* AuthTokenService
    const authProfileService = yield* AuthProfileService
    const mailer = yield* Mailer

    const newUserId = ulid()
    const user = yield* userService.findByEmail(payload.email).pipe(
      Effect.catchTag('UserServiceNotFoundError', () =>
        userService.create({
          ...payload,
          status: 'NOT_VERIFIED',
          role: 'USER',
          profile_picture_id: null,
          deleted_at: null,
          id: newUserId
        })
      )
    )
    const isNewUser = user.id === newUserId

    yield* authTokenService.createVerificationToken(user)

    if (isNewUser) {
      yield* authProfileService.create({
        id: ulid(),
        meta: {
          key: 'EMAIL',
          email: payload.email
        },
        user_id: user.id
      })

      const email = yield* WelcomeMail()

      yield* mailer.send({
        recipients: [payload.email],
        subject: 'Welcome to nora-health!',
        email
      })
    }
  })
