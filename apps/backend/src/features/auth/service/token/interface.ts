import { Context, type Effect } from 'effect'
import type { AuthToken, User } from '@nora-health/domain'
import type {
  AuthTokenServiceError,
  AuthTokenServiceInvalidTokenError,
  AuthTokenServiceTokenExpiredError,
  AuthTokenServiceTokenNotExpiredError
} from './error'

export class AuthTokenService extends Context.Tag('AuthTokenService')<
  AuthTokenService,
  {
    createVerificationToken: (
      user: User
    ) => Effect.Effect<
      AuthToken,
      AuthTokenServiceTokenNotExpiredError | AuthTokenServiceError
    >

    verifyVerificationToken: (
      userId: string,
      token: string
    ) => Effect.Effect<
      AuthToken,
      | AuthTokenServiceError
      | AuthTokenServiceInvalidTokenError
      | AuthTokenServiceTokenExpiredError
    >

    create: (
      hashInput: string
    ) => Effect.Effect<
      AuthToken,
      AuthTokenServiceTokenNotExpiredError | AuthTokenServiceError
    >

    verify: (
      hashInput: string,
      noDelete?: boolean
    ) => Effect.Effect<
      AuthToken,
      | AuthTokenServiceError
      | AuthTokenServiceInvalidTokenError
      | AuthTokenServiceTokenExpiredError
    >

    deleteByHash: (hash: string) => Effect.Effect<void, AuthTokenServiceError>

    deleteExpired: () => Effect.Effect<void, AuthTokenServiceError>
  }
>() {}
