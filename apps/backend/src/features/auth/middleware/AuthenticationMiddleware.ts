import AuthenticationMiddleware from '@nora-health/api/Auth/AuthenticationMiddleware'
import { Effect, Layer, Redacted } from 'effect' // Keep Option import for userRepository.findById
import { AuthSessionService } from '../service'
import UnauthorizedError from '@nora-health/api/common/UnauthorizedError'
import UnexpectedError from '@nora-health/api/common/UnexpectedError'
import { UserService } from '@/features/user/service' // Added

export const AuthenticationMiddlewareLive = Layer.effect(
  AuthenticationMiddleware,
  Effect.gen(function* () {
    const authSessionService = yield* AuthSessionService
    const userService = yield* UserService // Added

    return AuthenticationMiddleware.of({
      token: (token) =>
        Effect.gen(function* () {
          const _token = Redacted.value(token)

          const session = yield* authSessionService.findById(_token)

          yield* authSessionService.extendExpiry(session.id)

          const fullUser = yield* userService.findById(session.user_id)

          return fullUser
        }).pipe(
          Effect.catchTags({
            InvalidSessionError: () => Effect.fail(new UnauthorizedError()),
            AuthSessionServiceError: () => Effect.fail(new UnexpectedError()),
            UserServiceNotFoundError: () =>
              Effect.fail(new UnauthorizedError()),
            UserServiceError: () => Effect.fail(new UnexpectedError())
          })
        )
    })
  })
)
