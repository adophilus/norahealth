import { Effect, Layer, Option } from 'effect'
import { AuthTokenService } from './interface'
import { AuthTokenRepository } from '../../repository/token/interface'
import {
  AuthTokenServiceError,
  AuthTokenServiceInvalidTokenError,
  AuthTokenServiceTokenExpiredError,
  AuthTokenServiceTokenNotExpiredError
} from './error'
import { ulid } from 'ulidx'
import { AppConfig } from '@/features/config'
import { getUnixTime } from 'date-fns'
import {
  create,
  deserializeToken,
  generateHash,
  generateOtp,
  verify
} from './utils'
import { TOKEN_TTL_SECONDS } from './constants'
import { Mailer } from '@/features/mailer/service'
import {
  SignInVerificationMail,
  type SignInVerificationMailProps
} from '@/emails'
import { AuthToken } from '@nora-health/domain'

export const EmailAuthTokenServiceLive = Layer.effect(
  AuthTokenService,
  Effect.gen(function* () {
    const config = yield* AppConfig
    const authTokenRepository = yield* AuthTokenRepository
    const mailer = yield* Mailer

    const HASH_KEY = 'email'

    const makeSignInVerificationMail = (props: SignInVerificationMailProps) =>
      SignInVerificationMail(props).pipe(
        Effect.provide(Layer.succeed(AppConfig, config))
      )

    const verifyToken = (userId: string, tokenValue: string, purpose: string) =>
      Effect.gen(function* () {
        const hash = generateHash(HASH_KEY, userId, purpose)

        const dbToken = yield* authTokenRepository.findByHash(hash).pipe(
          Effect.mapError(
            (error) =>
              new AuthTokenServiceError({
                message: error.message,
                cause: error
              })
          ),
          Effect.map(Option.getOrNull)
        )

        if (!dbToken) return yield* new AuthTokenServiceInvalidTokenError({})
        const token = yield* deserializeToken(dbToken)

        const currentTime = getUnixTime(new Date())
        if (token.expires_at < currentTime) {
          return yield* new AuthTokenServiceTokenExpiredError({})
        }

        if (token.provider.id !== 'email') {
          return yield* new AuthTokenServiceError({
            message: 'Invalid provider'
          })
        }

        if (token.provider.code !== tokenValue) {
          return yield* new AuthTokenServiceInvalidTokenError({})
        }

        yield* authTokenRepository.deleteById(token.id).pipe(
          Effect.mapError(
            (error) =>
              new AuthTokenServiceError({
                message: error.message,
                cause: error
              })
          )
        )

        return token
      }).pipe(
        Effect.catchTags({
          UnknownException: () =>
            Effect.fail(new AuthTokenServiceInvalidTokenError({})),
          ParseError: () =>
            Effect.fail(new AuthTokenServiceInvalidTokenError({}))
        })
      )

    return AuthTokenService.of({
      createVerificationToken: (user) =>
        Effect.gen(function* () {
          const currentTime = getUnixTime(new Date())
          const tokenExpiry = currentTime + TOKEN_TTL_SECONDS

          const userEmailAddress = user.email

          if (!userEmailAddress)
            return yield* new AuthTokenServiceError({
              message: 'User does not have an email address'
            })

          const hash = generateHash(HASH_KEY, user.id, 'VERIFICATION')

          const existingTokenOption = yield* authTokenRepository
            .findByHash(hash)
            .pipe(
              Effect.mapError(
                (error) =>
                  new AuthTokenServiceError({
                    message: error.message,
                    cause: error
                  })
              )
            )

          if (Option.isSome(existingTokenOption)) {
            const existingToken = existingTokenOption.value
            const hasTokenExpired = existingToken.expires_at < currentTime

            if (hasTokenExpired) {
              yield* authTokenRepository.deleteById(existingToken.id).pipe(
                Effect.mapError(
                  (error) =>
                    new AuthTokenServiceError({
                      message: `Failed to delete expired token before creating new: ${error.message}`,
                      cause: error
                    })
                )
              )
            } else {
              return yield* Effect.fail(
                new AuthTokenServiceTokenNotExpiredError({
                  expires_at: existingToken.expires_at
                })
              )
            }
          }

          const provider = {
            id: 'email',
            code: generateOtp()
          } as const

          const token = yield* authTokenRepository
            .create({
              id: ulid(),
              hash,
              provider: JSON.stringify(provider),
              expires_at: tokenExpiry
            })
            .pipe(
              Effect.mapError(
                (error) =>
                  new AuthTokenServiceError({
                    message: error.message,
                    cause: error
                  })
              )
            )

          const email = yield* makeSignInVerificationMail({
            otp: provider.code
          })

          yield* mailer.send({
            recipients: [userEmailAddress],
            subject: `Your verification code is ${provider.code}`,
            email
          })

          return AuthToken.make({ ...token, provider })
        }).pipe(
          Effect.mapError((error) => {
            if (
              error._tag === 'MailerRenderingError' ||
              error._tag === 'MailerTransportError' ||
              error._tag === 'MailerValidationError'
            ) {
              return new AuthTokenServiceError({
                message: error.message
              })
            }

            return error
          })
        ),

      verifyVerificationToken(userId, token) {
        return verifyToken(userId, token, 'VERIFICATION')
      },

      create: (hashInput) =>
        create(hashInput).pipe(
          Effect.provideService(AuthTokenRepository, authTokenRepository)
        ),

      verify: (hashInput, noDelete) =>
        verify(hashInput, noDelete).pipe(
          Effect.provideService(AuthTokenRepository, authTokenRepository)
        ),

      deleteByHash: (hash) =>
        authTokenRepository.deleteByHash(hash).pipe(
          Effect.mapError(
            (error) =>
              new AuthTokenServiceError({
                message: error.message,
                cause: error
              })
          )
        ),

      deleteExpired: () =>
        authTokenRepository.deleteExpired().pipe(
          Effect.mapError(
            (error) =>
              new AuthTokenServiceError({
                message: error.message,
                cause: error
              })
          )
        )
    })
  })
)
