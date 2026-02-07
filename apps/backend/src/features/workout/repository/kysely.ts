import { Effect, Layer, Option } from 'effect'
import { KyselyClient } from '@/features/database/kysely'
import { WorkoutRepositoryError } from './error'
import { WorkoutRepository } from './interface'

export const KyselyWorkoutRepositoryLive = Layer.effect(
  WorkoutRepository,
  Effect.gen(function* () {
    const db = yield* KyselyClient

    return WorkoutRepository.of({
      create: (payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .insertInto('workouts')
              .values(payload)
              .returningAll()
              .executeTakeFirstOrThrow(),
          catch: (error) =>
            new WorkoutRepositoryError({
              message: 'Failed to create workout',
              cause: error
            })
        }),

      update: (id, payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .updateTable('workouts')
              .set(payload)
              .where('id', '=', id)
              .where('deleted_at', 'is', null)
              .returningAll()
              .executeTakeFirst(),
          catch: (error) =>
            new WorkoutRepositoryError({
              message: `Failed to update workout with id: ${id}`,
              cause: error
            })
        }).pipe(Effect.map(Option.fromNullable)),

      delete: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .updateTable('workouts')
              .set({ deleted_at: Date.now() })
              .where('id', '=', id)
              .where('deleted_at', 'is', null)
              .returningAll()
              .executeTakeFirst(),
          catch: (error) =>
            new WorkoutRepositoryError({
              message: `Failed to delete workout with id: ${id}`,
              cause: error
            })
        }).pipe(Effect.map(Option.fromNullable)),

      findByFitnessGoals: (goals) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('workouts')
              .selectAll()
              .where('deleted_at', 'is', null)
              .where('fitness_goals', 'like', `%${goals.join(',')}%`)
              .execute(),
          catch: (error) =>
            new WorkoutRepositoryError({
              message: 'Failed to find workouts by fitness goals',
              cause: error
            })
        }),

      findByBodyTargets: (targets) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('workouts')
              .selectAll()
              .where('deleted_at', 'is', null)
              .where('body_targets', 'like', `%${targets.join(',')}%`)
              .execute(),
          catch: (error) =>
            new WorkoutRepositoryError({
              message: 'Failed to find workouts by body targets',
              cause: error
            })
        }),

      findByInjuriesExcluded: (excludedInjuries) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('workouts')
              .selectAll()
              .where('deleted_at', 'is', null)
              .where((eb) =>
                eb.or(
                  excludedInjuries.map((injury) =>
                    eb('contraindications', 'not like', `%${injury}%`)
                  )
                )
              )
              .execute(),
          catch: (error) =>
            new WorkoutRepositoryError({
              message: 'Failed to find workouts excluding injuries',
              cause: error
            })
        }),

      findByGoalAndBodyTargets: (goals, targets) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('workouts')
              .selectAll()
              .where('deleted_at', 'is', null)
              .where('fitness_goals', 'like', `%${goals.join(',')}%`)
              .where('body_targets', 'like', `%${targets.join(',')}%`)
              .execute(),
          catch: (error) =>
            new WorkoutRepositoryError({
              message: 'Failed to find workouts by goals and body targets',
              cause: error
            })
        }),

      findAll: () =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('workouts')
              .selectAll()
              .where('deleted_at', 'is', null)
              .execute(),
          catch: (error) =>
            new WorkoutRepositoryError({
              message: 'Failed to find all workouts',
              cause: error
            })
        }),

      findById: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('workouts')
              .selectAll()
              .where('id', '=', id)
              .where('deleted_at', 'is', null)
              .executeTakeFirst(),
          catch: (error) =>
            new WorkoutRepositoryError({
              message: `Failed to find workout with id: ${id}`,
              cause: error
            })
        }).pipe(Effect.map(Option.fromNullable))
    })
  })
)
