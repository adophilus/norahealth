import { AuthDepLayer, DatabaseLayer, MailerLayer } from '@/bootstrap'
import { AuthTokenRepository } from '@/features/auth'
import { AppConfigLive, EnvLive } from '@/features/config'
import { assert, describe, it } from '@effect/vitest'
import type { AuthToken } from '@nora-health/domain'
import { Effect, Layer, Option } from 'effect'
import { ulid } from 'ulidx'

const TestLive = AuthDepLayer.pipe(
  Layer.provide(MailerLayer),
  Layer.provide(DatabaseLayer),
  Layer.provide(AppConfigLive),
  Layer.provide(EnvLive)
)

describe('AuthTokenRepository', () => {
  let authToken: AuthToken

  it.effect('should create an auth token', () =>
    Effect.gen(function* () {
      const repo = yield* AuthTokenRepository

      const TOKEN_TTL_SECONDS = 300 // 5 minutes

      const currentTime = getUnixTime(new Date())
      const tokenExpiry = currentTime + TOKEN_TTL_SECONDS

      authToken = yield* repo.create({
        id: ulid(),
        provider: { id: 'termii', pin_id: '1234' },
        hash: 'hash',
        expires_at: tokenExpiry
      })

      assert(tokenExpiry === authToken.expires_at)
    }).pipe(Effect.provide(TestLive))
  )

  it.effect('should get the auth token by id', () =>
    Effect.gen(function* () {
      const repo = yield* AuthTokenRepository
      const res = yield* repo.findById(authToken.id)
      assert(Option.isSome(res))
    }).pipe(Effect.provide(TestLive))
  )
})
