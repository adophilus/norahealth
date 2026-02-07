import { Effect, Layer, Option } from 'effect'
import { KyselyClient } from '@/features/database/kysely'
import { DailyMealPlanRepositoryError } from './error'
import { DailyMealPlanRepository } from './interface'
import { getUnixTime } from 'date-fns'

export const KyselyDailyMealPlanRepositoryLive = Layer.effect(
  DailyMealPlanRepository,
  Effect.gen(function* () {
    const db = yield* KyselyClient

    return DailyMealPlanRepository.of({
      create: (payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .insertInto('daily_meal_plans')
              .values(payload)
              .returningAll()
              .executeTakeFirstOrThrow(),
          catch: (error) =>
            new DailyMealPlanRepositoryError({
              message: 'Failed to create daily meal plan',
              cause: error
            })
        }),

      findByUserIdAndDateRange: (userId, startDate, endDate) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('daily_meal_plans')
              .selectAll()
              .where('user_id', '=', userId)
              .where('date', '>=', startDate)
              .where('date', '<=', endDate)
              .where('deleted_at', 'is', null)
              .orderBy('date')
              .execute(),
          catch: (error) =>
            new DailyMealPlanRepositoryError({
              message: `Failed to find daily meal plans for user ${userId} between ${startDate} and ${endDate}`,
              cause: error
            })
        }),

      updateById: (id, payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .updateTable('daily_meal_plans')
              .set({
                ...payload,
                updated_at: getUnixTime(new Date())
              })
              .where('id', '=', id)
              .where('deleted_at', 'is', null)
              .returningAll()
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new DailyMealPlanRepositoryError({
              message: `Failed to update daily meal plan with id ${id}`,
              cause: error
            })
        }),

      findByUserId: (userId) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('daily_meal_plans')
              .selectAll()
              .where('user_id', '=', userId)
              .where('deleted_at', 'is', null)
              .orderBy('date', 'desc')
              .execute(),
          catch: (error) =>
            new DailyMealPlanRepositoryError({
              message: `Failed to find daily meal plans for user ${userId}`,
              cause: error
            })
        }),

      deleteById: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .updateTable('daily_meal_plans')
              .set({ deleted_at: Date.now() })
              .where('id', '=', id)
              .returningAll()
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new DailyMealPlanRepositoryError({
              message: `Failed to delete daily meal plan with id ${id}`,
              cause: error
            })
        }),

      findByUserIdAndDate: (userId, date) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('daily_meal_plans')
              .selectAll()
              .where('user_id', '=', userId)
              .where('date', '=', date)
              .where('deleted_at', 'is', null)
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new DailyMealPlanRepositoryError({
              message: `Failed to find daily meal plan for user ${userId} on ${date}`,
              cause: error
            })
        })
    })
  })
)
