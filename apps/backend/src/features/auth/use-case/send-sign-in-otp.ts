import type { SendSignInOtpRequestBody } from '@nora-health/api/Auth/SendSignInOtpEndpoint'
import { Effect } from 'effect'
import { WelcomeMail } from '@/emails'
import { Mailer } from '@/features/mailer'
import { UserService } from '@/features/user'
import { AuthTokenService } from '../service'

export const sendSignInOtpUseCase = (payload: SendSignInOtpRequestBody) =>
  Effect.gen(function*() {
    const userService = yield* UserService
    const authTokenService = yield* AuthTokenService
    const mailer = yield* Mailer

    const user = yield* userService.findByEmail(payload.email).pipe(
      Effect.catchTag('UserServiceNotFoundError', () =>
        Effect.gen(function*() {
          const user = yield* userService.create({
            ...payload,
            status: 'NOT_VERIFIED',
            role: 'USER',
            profile_picture_id: null
          })
          const email = yield* WelcomeMail()

          yield* mailer.send({
            recipients: [payload.email],
            subject: 'Welcome to NoraHealth!',
            email
          })

          return user
        })
      )
    )

    yield* authTokenService.createVerificationToken(user)
  })
