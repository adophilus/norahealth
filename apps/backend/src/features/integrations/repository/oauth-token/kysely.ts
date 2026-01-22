import { getUnixTime } from 'date-fns'
import { Effect, Layer, Option } from 'effect'
import { KyselyClient } from '@/features/database/kysely'
import { OAuthTokenRepositoryError, OAuthTokenNotFoundError } from './error'
import { OAuthTokenRepository } from './interface'

export const OAuthTokenRepositoryLive = Layer.effect(
  OAuthTokenRepository,
  Effect.gen(function*(_) {
    const db = yield* KyselyClient

    return OAuthTokenRepository.of({
      create: (payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .insertInto('oauth_tokens')
              .values(payload)
              .returningAll()
              .executeTakeFirstOrThrow(),
          catch: (error) =>
            new OAuthTokenRepositoryError({
              message: `Failed to create OAuth token: ${String(error)}`,
              cause: error
            })
        }),

      findByConnectedAccountId: (connectedAccountId) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('oauth_tokens')
              .selectAll()
              .where('connected_account_id', '=', connectedAccountId)
              .where('is_active', '=', true)
              .orderBy('created_at', 'desc')
              .execute(),
          catch: (error) =>
            new OAuthTokenRepositoryError({
              message: `Failed to find OAuth tokens: ${String(error)}`,
              cause: error
            })
        }),

      findByPlatformAccountId: (platformAccountId) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('oauth_tokens')
              .selectAll()
              .where('platform_account_id', '=', platformAccountId)
              .where('is_active', '=', true)
              .executeTakeFirst(),
          catch: (error) =>
            new OAuthTokenRepositoryError({
              message: `Failed to find OAuth token: ${String(error)}`,
              cause: error
            })
        }).pipe(Effect.map(Option.fromNullable)),

      findById: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('oauth_tokens')
              .selectAll()
              .where('id', '=', id)
              .executeTakeFirst(),
          catch: (error) =>
            new OAuthTokenRepositoryError({
              message: `Failed to find OAuth token by ID: ${String(error)}`,
              cause: error
            })
        }).pipe(Effect.map(Option.fromNullable)),

      findByUserIdAndPlatform: (userId, platform) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('oauth_tokens')
              .innerJoin(
                'connected_accounts',
                'oauth_tokens.connected_account_id',
                'connected_accounts.id'
              )
              .where('connected_accounts.user_id', '=', userId)
              .where('connected_accounts.platform', '=', platform)
              .where('connected_accounts.is_active', '=', true)
              .where('oauth_tokens.is_active', '=', true)
              .select([
                'oauth_tokens.id',
                'oauth_tokens.connected_account_id',
                'oauth_tokens.provider',
                'oauth_tokens.token_type',
                'oauth_tokens.platform_account_id',
                'oauth_tokens.access_token',
                'oauth_tokens.refresh_token',
                'oauth_tokens.expires_at',
                'oauth_tokens.scopes',
                'oauth_tokens.is_active',
                'oauth_tokens.created_at',
                'oauth_tokens.updated_at',
                'oauth_tokens.last_used_at',
                'oauth_tokens.revoked_at'
              ])
              .orderBy('oauth_tokens.created_at', 'desc')
              .executeTakeFirst(),
          catch: (error) =>
            new OAuthTokenRepositoryError({
              message: `Failed to find OAuth tokens for user: ${String(error)}`,
              cause: error
            })
        }).pipe(Effect.map(Option.fromNullable)),

      update: (id, payload) =>
        Effect.tryPromise({
          try: async () => {
            const result = await db
              .updateTable('oauth_tokens')
              .set({
                ...payload,
                updated_at: getUnixTime(new Date())
              })
              .where('id', '=', id)
              .returningAll()
              .executeTakeFirst()

            if (!result) {
              throw new Error('OAuth token not found')
            }

            return result
          },
          catch: (error) => {
            if (
              error instanceof Error &&
              error.message === 'OAuth token not found'
            ) {
              return new OAuthTokenNotFoundError({
                message: 'OAuth token not found'
              })
            }

            return new OAuthTokenRepositoryError({
              message: `Failed to update OAuth token: ${String(error)}`,
              cause: error
            })
          }
        }),

      revoke: (id) =>
        Effect.tryPromise({
          try: async () => {
            const result = await db
              .updateTable('oauth_tokens')
              .set({
                is_active: false,
                revoked_at: getUnixTime(new Date())
              })
              .where('id', '=', id)
              .returningAll()
              .executeTakeFirst()

            if (!result) {
              throw new Error('OAuth token not found')
            }

            return undefined
          },
          catch: (error) => {
            if (
              error instanceof Error &&
              error.message === 'OAuth token not found'
            ) {
              return new OAuthTokenNotFoundError({
                message: 'OAuth token not found'
              })
            }

            return new OAuthTokenRepositoryError({
              message: `Failed to revoke OAuth token: ${String(error)}`,
              cause: error
            })
          }
        })
    })
  })
)
