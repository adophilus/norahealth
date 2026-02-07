import type { AuthToken as TAuthToken } from '@/types'
import { AuthToken, AuthTokenProvider } from '@nora-health/domain'
import { getUnixTime } from 'date-fns'
import { Effect, Schema, Option } from 'effect'
import { createHash } from 'node:crypto'
import { TOKEN_TTL_SECONDS } from './constants'
import { AuthTokenRepository } from '../../repository'
import {
  AuthTokenServiceError,
  AuthTokenServiceInvalidTokenError,
  AuthTokenServiceTokenExpiredError,
  AuthTokenServiceTokenNotExpiredError
} from './error'
import { ulid } from 'ulidx'

export const generateRawHash = (input: string) => {
  const hasher = createHash('sha256')
  hasher.update(input)
  return hasher.digest('hex')
}

export const generateHash = (key: string, userId: string, purpose: string) =>
  generateRawHash(`${purpose}-${key}-${userId}`)

export const generateOtp = () =>
  Math.floor(1000 + Math.random() * 9000).toString()

export const deserializeToken = (token: TAuthToken.Selectable) =>
  Effect.try(() => JSON.parse(token.provider)).pipe(
    Effect.flatMap(Schema.decodeUnknown(AuthTokenProvider)),
    Effect.map((provider) => AuthToken.make({ ...token, provider }))
  )

export const create = (input: string) =>
  Effect.gen(function* () {
    const authTokenRepository = yield* AuthTokenRepository

    const currentTime = getUnixTime(new Date())
    const tokenExpiry = currentTime + TOKEN_TTL_SECONDS

    const hash = generateRawHash(input)

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
      code: input
    }

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

    return AuthToken.make({ ...token, provider })
  })

export const verify = (input: string, noDelete?: boolean) =>
  Effect.gen(function* () {
    const authTokenRepository = yield* AuthTokenRepository
    const hash = generateRawHash(input)

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

    if (!noDelete) {
      yield* authTokenRepository.deleteById(token.id).pipe(
        Effect.mapError(
          (error) =>
            new AuthTokenServiceError({
              message: error.message,
              cause: error
            })
        )
      )
    }

    return token
  }).pipe(
    Effect.catchTags({
      ParseError: () => Effect.fail(new AuthTokenServiceInvalidTokenError({})),
      UnknownException: () =>
        Effect.fail(new AuthTokenServiceInvalidTokenError({}))
    })
  )
