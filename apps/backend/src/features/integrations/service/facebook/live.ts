import { createHash, randomBytes } from 'node:crypto'
import { URL, URLSearchParams } from 'node:url'
import { getUnixTime } from 'date-fns'
import { Effect, Layer } from 'effect'
import { ulid } from 'ulidx'
import { AppConfig } from '@/features/config'
import {
  ConnectedAccountRepository,
  OAuthTokenRepository
} from '../../repository'
import { FacebookOAuthServiceError } from './error'
import { FacebookOAuthService } from './interface'

const FACEBOOK_GRAPH_API_URL = 'https://graph.facebook.com/v18.0'
const FACEBOOK_OAUTH_AUTHORIZE_URL =
  'https://www.facebook.com/v18.0/dialog/oauth'

const generateState = (userId: string) => {
  const timestamp = getUnixTime(new Date())
  const hash = createHash('sha256')
  hash.update(`${userId}:${timestamp}:${randomBytes(16).toString('hex')}`)
  return hash.digest('hex')
}

export const FacebookOAuthServiceLive = Layer.effect(
  FacebookOAuthService,
  Effect.gen(function*() {
    const config = yield* AppConfig
    const connectedAccountRepository = yield* ConnectedAccountRepository
    const oauthTokenRepository = yield* OAuthTokenRepository

    return FacebookOAuthService.of({
      generateAuthUrl: (userId) =>
        Effect.sync(() => {
          const state = generateState(userId)
          const scopes = [
            'email',
            'pages_read_engagement',
            'pages_manage_posts'
          ].join(',')

          const authUrl = new URL(FACEBOOK_OAUTH_AUTHORIZE_URL)
          authUrl.searchParams.set('client_id', config.facebook.appId)
          authUrl.searchParams.set(
            'redirect_uri',
            `${config.server.url}/integrations/facebook/oauth/callback`
          )
          authUrl.searchParams.set('scope', scopes)
          authUrl.searchParams.set('response_type', 'code')
          authUrl.searchParams.set('state', state)

          return { authUrl: authUrl.toString(), state }
        }),

      handleCallback: (code, state) =>
        Effect.gen(function*() {
          const body = new URLSearchParams()
          body.set('client_id', config.facebook.appId)
          body.set('client_secret', config.facebook.appSecret)
          body.set('code', code)
          body.set(
            'redirect_uri',
            `${config.server.url}/integrations/facebook/oauth/callback`
          )

          const tokenResponse = yield* Effect.tryPromise({
            try: async () => {
              const response = await fetch(
                `${FACEBOOK_GRAPH_API_URL}/oauth/access_token`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  body: body.toString()
                }
              )
              return response.json()
            },
            catch: (error) =>
              new FacebookOAuthServiceError({
                message: `Failed to exchange code for access token: ${String(error)}`,
                cause: error
              })
          })

          if (tokenResponse.error) {
            return yield* Effect.fail(
              new FacebookOAuthServiceError({
                message:
                  tokenResponse.error_description ||
                  'OAuth error from Facebook',
                cause: tokenResponse.error
              })
            )
          }

          const userResponse = yield* Effect.tryPromise({
            try: async () => {
              const response = await fetch(
                `${FACEBOOK_GRAPH_API_URL}/me?fields=id,name,picture&access_token=${tokenResponse.access_token}`
              )
              return response.json()
            },
            catch: (error) =>
              new FacebookOAuthServiceError({
                message: `Failed to fetch user info from Facebook: ${String(error)}`,
                cause: error
              })
          })

          const platformAccountId = userResponse.id
          const platformUsername = userResponse.name
          const platformDisplayName = userResponse.name
          const avatarUrl = userResponse.picture?.data?.url || null
          const profileUrl = `https://facebook.com/${platformAccountId}`

          const existingAccountOption =
            yield* connectedAccountRepository.findByUserIdAndPlatform(
              state,
              'FACEBOOK'
            )

          const existingAccount =
            existingAccountOption._tag === 'Some'
              ? existingAccountOption.value
              : null

          let accountId: string

          if (existingAccount) {
            yield* connectedAccountRepository.update(existingAccount.id, {
              platform_username: platformUsername,
              platform_display_name: platformDisplayName,
              profile_url: profileUrl,
              avatar_url: avatarUrl,
              last_connected_at: getUnixTime(new Date())
            })
            accountId = existingAccount.id
          } else {
            const newAccountId = ulid()
            yield* connectedAccountRepository.create({
              id: newAccountId,
              user_id: state,
              platform: 'FACEBOOK',
              platform_account_id: platformAccountId,
              platform_username: platformUsername,
              platform_display_name: platformDisplayName,
              profile_url: profileUrl,
              avatar_url: avatarUrl,
              is_active: true,
              is_primary: true,
              last_connected_at: getUnixTime(new Date())
            })
            accountId = newAccountId
          }

          const expiresAt = tokenResponse.expires_in
            ? getUnixTime(new Date()) + tokenResponse.expires_in
            : null

          const newTokenId = ulid()

          const oauthToken = yield* oauthTokenRepository.create({
            id: newTokenId,
            connected_account_id: accountId,
            provider: 'FACEBOOK',
            token_type: 'USER_TOKEN',
            platform_account_id: platformAccountId,
            access_token: tokenResponse.access_token,
            refresh_token: tokenResponse.refresh_token || null,
            expires_at: expiresAt,
            scopes: [],
            is_active: true,
            last_used_at: null,
            revoked_at: null
          })

          return {
            connectedAccount: existingAccount || {
              id: accountId,
              user_id: state
            },
            oauthToken
          }
        }).pipe(
          Effect.catchTags({
            ConnectedAccountRepositoryError: (error) =>
              Effect.fail(
                new FacebookOAuthServiceError({
                  message: `Repository error: ${error.message}`,
                  cause: error
                })
              ),
            OAuthTokenRepositoryError: (error) =>
              Effect.fail(
                new FacebookOAuthServiceError({
                  message: `Repository error: ${error.message}`,
                  cause: error
                })
              ),
            AlreadyConnectedError: (error) =>
              Effect.fail(
                new FacebookOAuthServiceError({
                  message: `Account already connected: ${error.message}`,
                  cause: error
                })
              ),
            ConnectedAccountNotFoundError: (error) =>
              Effect.fail(
                new FacebookOAuthServiceError({
                  message: `Account not found: ${error.message}`,
                  cause: error
                })
              )
          })
        ),

      refreshAccessToken: (tokenId) =>
        Effect.gen(function*(_) {
          const tokenOption = yield* oauthTokenRepository.findById(tokenId)

          const token = tokenOption._tag === 'Some' ? tokenOption.value : null

          if (!token) {
            return yield* Effect.fail(
              new FacebookOAuthServiceError({
                message: 'OAuth token not found'
              })
            )
          }

          const body = new URLSearchParams()
          body.set('client_id', config.facebook.appId)
          body.set('client_secret', config.facebook.appSecret)
          body.set('grant_type', 'refresh_token')

          if (token.refresh_token) {
            body.set('refresh_token', token.refresh_token)
          }

          const tokenResponse = yield* Effect.tryPromise({
            try: async () => {
              const response = await fetch(
                `${FACEBOOK_GRAPH_API_URL}/oauth/access_token`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  body: body.toString()
                }
              )
              return response.json()
            },
            catch: (error) =>
              new FacebookOAuthServiceError({
                message: `Failed to refresh access token: ${String(error)}`,
                cause: error
              })
          })

          if (tokenResponse.error) {
            return yield* Effect.fail(
              new FacebookOAuthServiceError({
                message:
                  tokenResponse.error_description || 'Failed to refresh token',
                cause: tokenResponse.error
              })
            )
          }

          const expiresAt = tokenResponse.expires_in
            ? getUnixTime(new Date()) + tokenResponse.expires_in
            : null

          const updatedToken = yield* oauthTokenRepository.update(tokenId, {
            access_token: tokenResponse.access_token,
            refresh_token: tokenResponse.refresh_token || token.refresh_token,
            expires_at: expiresAt,
            last_used_at: getUnixTime(new Date())
          })

          return updatedToken
        }).pipe(
          Effect.catchTags({
            OAuthTokenRepositoryError: (error) =>
              Effect.fail(
                new FacebookOAuthServiceError({
                  message: `Repository error: ${error.message}`,
                  cause: error
                })
              ),
            OAuthTokenNotFoundError: (error) =>
              Effect.fail(
                new FacebookOAuthServiceError({
                  message: `Token not found: ${error.message}`,
                  cause: error
                })
              )
          })
        )
    })
  })
)
