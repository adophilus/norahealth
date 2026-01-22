import { Effect, Layer, Option } from 'effect'
import { AuthSessionService } from './interface'
import { AuthSessionRepository } from '../../repository/session/interface'
import { InvalidSessionError, AuthSessionServiceError } from './error'
import type { AuthSession } from '@/types'
import { ulid } from 'ulidx'
import { getUnixTime } from 'date-fns'

export const AuthSessionServiceLive = Layer.effect(
  AuthSessionService,
  Effect.gen(function* () {
    const sessionRepository = yield* AuthSessionRepository

    const SESSION_TTL_DAYS = 30 // Total TTL for access token
    const SESSION_EXTEND_THRESHOLD_DAYS = 15 // Extend if less than 15 days remaining
    const SESSION_EXTENSION_DAYS = 15 // Extend by 15 days

    const validateAuthSession = (session: AuthSession.Selectable) =>
      Effect.gen(function* () {
        const currentTime = getUnixTime(new Date())
        if (session.expires_at < currentTime) {
          return yield* Effect.fail(
            new InvalidSessionError({ message: 'Session expired' })
          )
        }
        return session
      })

    return AuthSessionService.of({
      create: (userId) =>
        Effect.gen(function* () {
          const currentTime = getUnixTime(new Date())
          const newSessionId = ulid()

          const expires_at = currentTime + 86400 * SESSION_TTL_DAYS // 30 days initial TTL

          const payload: AuthSession.Insertable = {
            id: newSessionId,
            user_id: userId,
            expires_at: expires_at
          }

          return yield* sessionRepository.create(payload).pipe(
            Effect.mapError(
              (error) =>
                new AuthSessionServiceError({
                  message: error.message,
                  cause: error
                })
            )
          )
        }),

      findById: (id) =>
        Effect.gen(function* () {
          const sessionOption = yield* sessionRepository.findById(id).pipe(
            Effect.mapError(
              (error) =>
                new AuthSessionServiceError({
                  message: error.message,
                  cause: error
                })
            )
          )
          const session = yield* Option.match(sessionOption, {
            onNone: () =>
              Effect.fail(
                new InvalidSessionError({ message: 'Session not found' })
              ),
            onSome: Effect.succeed
          })

          return yield* validateAuthSession(session)
        }),

      validate: (session) => validateAuthSession(session), // Expose helper as validate method

      extendExpiry: (sessionId) =>
        Effect.gen(function* () {
          const sessionOption = yield* sessionRepository
            .findById(sessionId) // findById is still correct here as we extend by internal id
            .pipe(
              Effect.mapError(
                (error) =>
                  new AuthSessionServiceError({
                    message: error.message,
                    cause: error
                  })
              )
            )
          const session = yield* Option.match(sessionOption, {
            onNone: () =>
              Effect.fail(
                new InvalidSessionError({ message: 'Session not found' })
              ),
            onSome: Effect.succeed
          })

          yield* validateAuthSession(session) // Validate the retrieved session

          const currentTime = getUnixTime(new Date())
          if (
            session.expires_at - currentTime <
            86400 * SESSION_EXTEND_THRESHOLD_DAYS
          ) {
            // Check threshold
            const newExpiry =
              getUnixTime(new Date()) + 86400 * SESSION_EXTENSION_DAYS // Extend by 15 days
            return yield* sessionRepository
              .updateById(session.id, {
                expires_at: newExpiry
              }) // Updated payload
              .pipe(
                Effect.mapError(
                  (error) =>
                    new AuthSessionServiceError({
                      message: error.message,
                      cause: error
                    })
                )
              )
          }
          return session // Return original session if not extended
        }),

      deleteAllExpired: () =>
        sessionRepository.deleteAllExpired().pipe(
          Effect.mapError(
            (error) =>
              new AuthSessionServiceError({
                message: error.message,
                cause: error
              })
          )
        )
    })
  })
)
