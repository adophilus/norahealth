import { Effect, Layer, Option } from 'effect'
import { KyselyClient } from '@/features/database/kysely'
import { WorkoutSessionRepositoryError } from './error'
import { WorkoutSessionRepository } from './interface'

export const KyselyWorkoutSessionRepositoryLive = Layer.effect(
  WorkoutSessionRepository,
  Effect.gen(function* () {
    const db = yield* KyselyClient

    return WorkoutSessionRepository.of({
      create: (payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .insertInto('workout_sessions')
              .values(payload)
              .returningAll()
              .executeTakeFirstOrThrow(),
          catch: (error) =>
            new WorkoutSessionRepositoryError({
              message: 'Failed to create workout session',
              cause: error
            })
        }),

      update: (id, payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .updateTable('workout_sessions')
              .set(payload)
              .where('id', '=', id)
              .where('deleted_at', 'is', null)
              .returningAll()
              .executeTakeFirst(),
          catch: (error) =>
            new WorkoutSessionRepositoryError({
              message: `Failed to update workout session with id: ${id}`,
              cause: error
            })
        }).pipe(Effect.map(Option.fromNullable)),

      delete: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .updateTable('workout_sessions')
              .set({ deleted_at: Date.now() })
              .where('id', '=', id)
              .where('deleted_at', 'is', null)
              .returningAll()
              .executeTakeFirst(),
          catch: (error) =>
            new WorkoutSessionRepositoryError({
              message: `Failed to delete workout session with id: ${id}`,
              cause: error
            })
        }).pipe(Effect.map(Option.fromNullable)),

      findByUserId: (userId) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('workout_sessions')
              .selectAll()
              .where('user_id', '=', userId)
              .where('deleted_at', 'is', null)
              .execute(),
          catch: (error) =>
            new WorkoutSessionRepositoryError({
              message: `Failed to find workout sessions for user: ${userId}`,
              cause: error
            })
        }),

      findByWorkoutId: (workoutId) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('workout_sessions')
              .selectAll()
              .where('workout_id', '=', workoutId)
              .where('deleted_at', 'is', null)
              .execute(),
          catch: (error) =>
            new WorkoutSessionRepositoryError({
              message: `Failed to find workout sessions for workout: ${workoutId}`,
              cause: error
            })
        }),

      findByUserIdAndWorkoutId: (userId, workoutId) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('workout_sessions')
              .selectAll()
              .where('user_id', '=', userId)
              .where('workout_id', '=', workoutId)
              .where('deleted_at', 'is', null)
              .execute(),
          catch: (error) =>
            new WorkoutSessionRepositoryError({
              message: `Failed to find workout sessions for user: ${userId} and workout: ${workoutId}`,
              cause: error
            })
        }),

      findAll: () =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('workout_sessions')
              .selectAll()
              .where('deleted_at', 'is', null)
              .execute(),
          catch: (error) =>
            new WorkoutSessionRepositoryError({
              message: 'Failed to find all workout sessions',
              cause: error
            })
        }),

      findById: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('workout_sessions')
              .selectAll()
              .where('id', '=', id)
              .where('deleted_at', 'is', null)
              .executeTakeFirst(),
          catch: (error) =>
            new WorkoutSessionRepositoryError({
              message: `Failed to find workout session with id: ${id}`,
              cause: error
            })
        }).pipe(Effect.map(Option.fromNullable))
    })
  })
)
