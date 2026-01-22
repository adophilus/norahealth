import { Context, type Effect } from 'effect'
import type { FacebookOAuthServiceError } from './error'

export class FacebookOAuthService extends Context.Tag('FacebookOAuthService')<
  FacebookOAuthService,
  {
    generateAuthUrl: (userId: string) => Effect.Effect<
      {
        authUrl: string
        state: string
      },
      FacebookOAuthServiceError
    >

    handleCallback: (
      code: string,
      state: string
    ) => Effect.Effect<
      {
        connectedAccount: any
        oauthToken: any
      },
      FacebookOAuthServiceError
    >

    refreshAccessToken: (
      tokenId: string
    ) => Effect.Effect<any, FacebookOAuthServiceError>
  }
>() {}
