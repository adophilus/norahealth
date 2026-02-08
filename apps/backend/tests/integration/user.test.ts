import { beforeAll, describe, it } from '@effect/vitest'
import { Effect } from 'effect'
import {
  type ApiClient,
  generateMockUserWithSession,
  makeApiClient,
  ServerLive
} from '../utils'

describe('User API', () => {
  let Client: ApiClient

  beforeAll(async () => {
    const res = await generateMockUserWithSession().pipe(
      Effect.provide(ServerLive),
      Effect.runPromise
    )

    Client = makeApiClient(res.session.id)
  })

  it.live('should get current user profile', () =>
    Effect.gen(function* () {
      const client = yield* Client
      yield* client.User.getProfile({})
    }).pipe(Effect.provide(ServerLive))
  )

  it.effect('should fetch user profile by ID', () =>
    Effect.gen(function* () {
      const client = yield* Client

      // First get current user to get the ID
      const currentUser = yield* client.User.getProfile({})

      yield* client.User.fetchUserProfileById({
        path: { userId: currentUser.id }
      })
    }).pipe(Effect.provide(ServerLive))
  )

  it.effect('should update user profile', () =>
    Effect.gen(function* () {
      const client = yield* Client

      yield* client.User.updateUserProfile({
        payload: {}
      })
    }).pipe(Effect.provide(ServerLive))
  )

  it.effect('should complete user onboarding with health profile', () =>
    Effect.gen(function* () {
      const client = yield* Client

      const onboardingData = {
        name: 'Test User',
        age_group: '26_35',
        gender: 'MALE',
        height_cm: 175,
        weight_kg: 70,
        weight_class: 'NORMAL',
        fitness_level: 'intermediate',
        fitness_goals: ['WEIGHT_LOSS', 'MUSCLE_GAIN'],
        body_targets: ['CHEST', 'ARMS', 'LEGS'],
        dietary_restrictions: ['none'],
        allergies: [],
        workout_preferences: ['strength_training', 'cardio'],
        medical_conditions: {},
        injuries: [],
        weekly_workout_time: 4,
        location: {
          country: 'US',
          city: 'San Francisco'
        }
      } as const

      yield* client.User.completeOnboarding({
        payload: onboardingData
      })
    }).pipe(Effect.provide(ServerLive))
  )
})
