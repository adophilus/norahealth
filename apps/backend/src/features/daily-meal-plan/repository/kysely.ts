import type { DailyMealPlan } from '@nora-health/domain'
import { generateId } from '@nora-health/domain/Id'
import { Effect, Option } from 'effect'
import { KyselyClient } from '../../../database/kysely'
import {
  DailyMealPlanRepository,
  DailyMealPlanRepositoryError,
  DailyMealPlanRepositoryNotFoundError
} from './interface'

export const DailyMealPlanRepositoryLive = Effect.sync(() => {
  return DailyMealPlanRepository.of({
    create: (payload) =>
      Effect.gen(function* () {
        const db = yield* KyselyClient

        return yield* Effect.tryPromise({
          try: () =>
            db
              .insertInto('daily_meal_plans')
              .values({
                id: generateId(),
                ...payload,
                snacks: JSON.stringify(payload.snacks || []),
                created_at: Date.now()
              })
              .returningAll()
              .executeTakeFirstOrThrow(),
          catch: (error) =>
            new DailyMealPlanRepositoryError({
              message: 'Failed to create daily meal plan',
              cause: error
            })
        }).pipe(Effect.map(parseDailyMealPlan))
      }),

    findByUserIdAndDateRange: (userId, startDate, endDate) =>
      Effect.gen(function* () {
        const db = yield* KyselyClient

        return yield* Effect.tryPromise({
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
        })
          .pipe(Effect.map(Array.from))
          .pipe(Effect.map(Effect.map(parseDailyMealPlan)))
      }),

    update: (id, payload) =>
      Effect.gen(function* () {
        const db = yield* KyselyClient

        const updateData: Record<string, any> = {
          ...payload,
          updated_at: Date.now()
        }

        if (updateData.snacks) {
          updateData.snacks = JSON.stringify(updateData.snacks)
        }

        return yield* Effect.tryPromise({
          try: () =>
            db
              .updateTable('daily_meal_plans')
              .set(updateData)
              .where('id', '=', id)
              .where('deleted_at', 'is', null)
              .returningAll()
              .executeTakeFirstOrThrow(),
          catch: (error) =>
            new DailyMealPlanRepositoryError({
              message: `Failed to update daily meal plan with id ${id}`,
              cause: error
            })
        }).pipe(Effect.map(parseDailyMealPlan))
      }),

    findByUserId: (userId) =>
      Effect.gen(function* () {
        const db = yield* KyselyClient

        return yield* Effect.tryPromise({
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
        })
          .pipe(Effect.map(Array.from))
          .pipe(Effect.map(Effect.map(parseDailyMealPlan)))
      }),

    delete: (id) =>
      Effect.gen(function* () {
        const db = yield* KyselyClient

        return yield* Effect.tryPromise({
          try: () =>
            db
              .updateTable('daily_meal_plans')
              .set({ deleted_at: Date.now() })
              .where('id', '=', id)
              .execute(),
          catch: (error) =>
            new DailyMealPlanRepositoryError({
              message: `Failed to delete daily meal plan with id ${id}`,
              cause: error
            })
        })
      }),

    findByUserIdAndDate: (userId, date) =>
      Effect.gen(function* () {
        const db = yield* KyselyClient

        return yield* Effect.tryPromise({
          try: () =>
            db
              .selectFrom('daily_meal_plans')
              .selectAll()
              .where('user_id', '=', userId)
              .where('date', '=', date)
              .where('deleted_at', 'is', null)
              .executeTakeFirst(),
          catch: (error) =>
            new DailyMealPlanRepositoryError({
              message: `Failed to find daily meal plan for user ${userId} on ${date}`,
              cause: error
            })
        })
          .pipe(Effect.map(Option.fromNullable))
          .pipe(Effect.map(Option.map(parseDailyMealPlan)))
      })
  })
})

const parseDailyMealPlan = (record: any): DailyMealPlan => ({
  ...record,
  snacks: JSON.parse(record.snacks || '[]')
})
