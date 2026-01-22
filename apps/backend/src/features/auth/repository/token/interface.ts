import { Context, type Option, type Effect } from 'effect'
import type { AuthToken } from '@/types'
import type {
  AuthTokenRepositoryError,
  AuthTokenRepositoryConstraintError
} from './error'

export class AuthTokenRepository extends Context.Tag('AuthTokenRepository')<
  AuthTokenRepository,
  {
    create: (
      payload: AuthToken.Insertable
    ) => Effect.Effect<
      AuthToken.Selectable,
      AuthTokenRepositoryConstraintError | AuthTokenRepositoryError
    >

    findByHash: (
      hash: string
    ) => Effect.Effect<
      Option.Option<AuthToken.Selectable>,
      AuthTokenRepositoryError
    >

    updateById: (
      id: string,
      payload: Omit<
        AuthToken.Updateable,
        'id' | 'user_id' | 'purpose' | 'created_at' | 'updated_at'
      >
    ) => Effect.Effect<AuthToken.Selectable, AuthTokenRepositoryError>

    findById: (
      id: string
    ) => Effect.Effect<
      Option.Option<AuthToken.Selectable>,
      AuthTokenRepositoryError
    >

    deleteById: (id: string) => Effect.Effect<void, AuthTokenRepositoryError>

    deleteByHash: (
      hash: string
    ) => Effect.Effect<void, AuthTokenRepositoryError>

    deleteExpired: () => Effect.Effect<
      // Renamed from findExpired
      void, // Changed return type to void
      AuthTokenRepositoryError
    >
  }
>() {}
