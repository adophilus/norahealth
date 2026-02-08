import { Effect, Layer, Option } from 'effect'
import { KyselyClient } from '@/features/database/kysely'
import { DailyWorkoutPlanRepositoryError } from './error'
import { DailyWorkoutPlanRepository } from './interface'

export const KyselyDailyWorkoutPlanRepositoryLive = Layer.effect(
  DailyWorkoutPlanRepository,
  Effect.gen(function* () {
    const db = yield* KyselyClient

    return DailyWorkoutPlanRepository.of({
      create: (payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .insertInto('daily_workout_plans')
              .values(payload)
              .returningAll()
              .executeTakeFirstOrThrow(),
          catch: (error) =>
            new DailyWorkoutPlanRepositoryError({
              message: 'Failed to create daily workout plan',
              cause: error
            })
        }),

      update: (id, payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .updateTable('daily_workout_plans')
              .set(payload)
              .where('id', '=', id)

              .returningAll()
              .executeTakeFirst(),
          catch: (error) =>
            new DailyWorkoutPlanRepositoryError({
              message: `Failed to update daily workout plan with id: ${id}`,
              cause: error
            })
        }).pipe(Effect.map(Option.fromNullable)),

      delete: (id) =>
        Effect.tryPromise({
          try: async () => {
            const plan = await db
              .selectFrom('daily_workout_plans')
              .selectAll()
              .where('id', '=', id)
              .executeTakeFirst()

            if (!plan) {
              return Option.none()
            }

            await db
              .deleteFrom('daily_workout_plans')
              .where('id', '=', id)
              .execute()

            return Option.some(plan)
          },
          catch: (error) =>
            new DailyWorkoutPlanRepositoryError({
              message: `Failed to delete daily workout plan with id: ${id}`,
              cause: error
            })
        }),

      findByUserId: (userId) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('daily_workout_plans')
              .selectAll()
              .where('user_id', '=', userId)

              .execute(),
          catch: (error) =>
            new DailyWorkoutPlanRepositoryError({
              message: `Failed to find daily workout plans for user: ${userId}`,
              cause: error
            })
        }),

      findByUserIdAndDate: (userId, date) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('daily_workout_plans')
              .selectAll()
              .where('user_id', '=', userId)
              .where('date', '=', date)

              .executeTakeFirst(),
          catch: (error) =>
            new DailyWorkoutPlanRepositoryError({
              message: `Failed to find daily workout plan for user: ${userId} and date: ${date}`,
              cause: error
            })
        }).pipe(Effect.map(Option.fromNullable)),

      findByUserIdAndDateRange: (userId, startDate, endDate) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('daily_workout_plans')
              .selectAll()
              .where('user_id', '=', userId)
              .where('date', '>=', startDate)
              .where('date', '<=', endDate)

              .execute(),
          catch: (error) =>
            new DailyWorkoutPlanRepositoryError({
              message: `Failed to find daily workout plans for user: ${userId} between ${startDate} and ${endDate}`,
              cause: error
            })
        }),

      findAll: () =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('daily_workout_plans')
              .selectAll()

              .execute(),
          catch: (error) =>
            new DailyWorkoutPlanRepositoryError({
              message: 'Failed to find all daily workout plans',
              cause: error
            })
        }),

      findById: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('daily_workout_plans')
              .selectAll()
              .where('id', '=', id)

              .executeTakeFirst(),
          catch: (error) =>
            new DailyWorkoutPlanRepositoryError({
              message: `Failed to find daily workout plan with id: ${id}`,
              cause: error
            })
        }).pipe(Effect.map(Option.fromNullable))
    })
  })
)
