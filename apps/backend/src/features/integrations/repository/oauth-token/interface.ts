import { Context, type Effect, type Option } from 'effect'
import type { OAuthToken as TOAuthToken } from '@/types'
import type {
  OAuthTokenRepositoryError,
  OAuthTokenNotFoundError
} from './error'
import type { PlatformName } from '@nora-health/domain'

export class OAuthTokenRepository extends Context.Tag('OAuthTokenRepository')<
  OAuthTokenRepository,
  {
    create: (
      payload: TOAuthToken.Insertable
    ) => Effect.Effect<TOAuthToken.Selectable, OAuthTokenRepositoryError>

    findByConnectedAccountId: (
      connectedAccountId: string
    ) => Effect.Effect<TOAuthToken.Selectable[], OAuthTokenRepositoryError>

    findByPlatformAccountId: (
      platformAccountId: string
    ) => Effect.Effect<
      Option.Option<TOAuthToken.Selectable>,
      OAuthTokenRepositoryError
    >

    findById: (
      id: string
    ) => Effect.Effect<
      Option.Option<TOAuthToken.Selectable>,
      OAuthTokenRepositoryError
    >

    findByUserIdAndPlatform: (
      userId: string,
      platform: PlatformName
    ) => Effect.Effect<
      Option.Option<TOAuthToken.Selectable>,
      OAuthTokenRepositoryError
    >

    update: (
      id: string,
      payload: Omit<TOAuthToken.Updateable, 'updated_at'>
    ) => Effect.Effect<
      TOAuthToken.Selectable,
      OAuthTokenRepositoryError | OAuthTokenNotFoundError
    >

    revoke: (
      id: string
    ) => Effect.Effect<
      void,
      OAuthTokenRepositoryError | OAuthTokenNotFoundError
    >
  }
>() {}
