import { it, describe, beforeAll } from '@effect/vitest'
import { Effect } from 'effect'
import {
  type ApiClient,
  createMockUserSignUpDetails,
  makeApiClient,
  ServerLive
} from '../utils'

describe('Auth API', () => {
  const userDetails = createMockUserSignUpDetails()
  let Client: ApiClient

  beforeAll(() => {
    Client = makeApiClient()
  })

  it.effect('should send the sign in email', () =>
    Effect.gen(function* () {
      const client = yield* Client

      yield* client.Auth.sendSignInOtp({
        payload: userDetails
      })
    }).pipe(Effect.provide(ServerLive))
  )

  it.effect('should verify the sign in email', () =>
    Effect.gen(function* () {
      const client = yield* Client

      yield* client.Auth.verifyOtp({
        payload: {
          ...userDetails,
          otp: '1234'
        }
      })
    }).pipe(Effect.provide(ServerLive))
  )
})
