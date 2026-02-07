import { Effect, Layer, Option } from 'effect'
import { AuthTokenService } from './interface'
import { AuthTokenRepository } from '../../repository'
import {
  AuthTokenServiceError,
  AuthTokenServiceInvalidTokenError,
  AuthTokenServiceTokenExpiredError,
  AuthTokenServiceTokenNotExpiredError
} from './error'
import { ulid } from 'ulidx'
import { createHash } from 'node:crypto'
import { getUnixTime } from 'date-fns'
import { create, verify, deserializeToken } from './utils'
import { AuthToken } from '@nora-health/domain'
import { TOKEN_TTL_SECONDS } from './constants'

const generateHash = (userId: string, purpose: string) => {
  const hasher = createHash('sha256')
  hasher.update(`${purpose}-default-${userId}`)
  return hasher.digest('hex')
}

export const DefaultAuthTokenServiceLive = Layer.effect(
  AuthTokenService,
  Effect.gen(function* () {
    const authTokenRepository = yield* AuthTokenRepository

    const verifyToken = (userId: string, tokenValue: string, purpose: string) =>
      Effect.gen(function* () {
        const hash = generateHash(userId, purpose)

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

        if (token.provider.id !== 'default') {
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

          const hash = generateHash(user.id, 'VERIFICATION')

          // Check for existing unexpired token for the same user and purpose
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
            id: 'default' as const,
            code: '1234'
          }

          const dbToken = yield* authTokenRepository
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

          const token = AuthToken.make({ ...dbToken, provider })

          return token
        }),

      create: (hashInput) =>
        create(hashInput).pipe(
          Effect.provideService(AuthTokenRepository, authTokenRepository)
        ),

      verify: (hashInput, noDelete) =>
        verify(hashInput, noDelete).pipe(
          Effect.provideService(AuthTokenRepository, authTokenRepository)
        ),

      verifyVerificationToken(userId, token) {
        return verifyToken(userId, token, 'VERIFICATION')
      },

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
