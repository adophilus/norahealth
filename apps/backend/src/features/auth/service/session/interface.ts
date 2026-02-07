import { Context, type Effect } from 'effect'
import type { AuthSession as TAuthSession } from '@/types'
import type { AuthSessionServiceError, InvalidSessionError } from './error' // Import InvalidSessionError
import type { AuthSession } from '@nora-health/domain'

export class AuthSessionService extends Context.Tag('AuthSessionService')<
  AuthSessionService,
  {
    create: (
      userId: string
    ) => Effect.Effect<AuthSession, AuthSessionServiceError>

    findById: (
      id: string
    ) => Effect.Effect<
      AuthSession,
      AuthSessionServiceError | InvalidSessionError
    >

    extendExpiry: (
      sessionId: string
    ) => Effect.Effect<
      TAuthSession.Selectable,
      AuthSessionServiceError | InvalidSessionError
    > // Changed error type

    deleteAllExpired: () => Effect.Effect<void, AuthSessionServiceError>

    validate: (
      session: TAuthSession.Selectable
    ) => Effect.Effect<AuthSession, InvalidSessionError> // Removed AuthSessionServiceError as it will not interact with repo directly
  }
>() {}
