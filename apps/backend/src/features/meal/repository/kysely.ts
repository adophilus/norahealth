import { Effect, Layer, Option } from 'effect'
import { KyselyClient } from '@/features/database/kysely'
import { MealRepositoryError } from './error'
import { MealRepository } from './interface'

export const MealRepositoryLive = Layer.effect(
  MealRepository,
  Effect.gen(function* () {
    const db = yield* KyselyClient

    return MealRepository.of({
      create: (payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .insertInto('meals')
              .values(payload)
              .returningAll()
              .executeTakeFirstOrThrow(),
          catch: (error) =>
            new MealRepositoryError({
              message: 'Failed to create meal',
              cause: error
            })
        }),

      findByFitnessGoals: (goals) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('meals')
              .selectAll()
              .where('deleted_at', 'is', null)
              .execute(),
          catch: (error) =>
            new MealRepositoryError({
              message: 'Failed to find meals by fitness goals',
              cause: error
            })
        }),

      findByAllergensExcluded: (excludedAllergens) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('meals')
              .selectAll()
              .where('deleted_at', 'is', null)
              .execute(),
          catch: (error) =>
            new MealRepositoryError({
              message: 'Failed to find meals excluding allergens',
              cause: error
            })
        }),

      findByFoodClasses: (foodClasses) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('meals')
              .selectAll()
              .where('deleted_at', 'is', null)
              .execute(),
          catch: (error) =>
            new MealRepositoryError({
              message: 'Failed to find meals by food classes',
              cause: error
            })
        }),

      findByGoalAndAllergens: (goals, excludedAllergens) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('meals')
              .selectAll()
              .where('deleted_at', 'is', null)
              .execute(),
          catch: (error) =>
            new MealRepositoryError({
              message: 'Failed to find meals by goals and allergens',
              cause: error
            })
        }),

      findAll: () =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('meals')
              .selectAll()
              .where('deleted_at', 'is', null)
              .execute(),
          catch: (error) =>
            new MealRepositoryError({
              message: 'Failed to find all meals',
              cause: error
            })
        }),

      findById: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('meals')
              .selectAll()
              .where('id', '=', id)
              .where('deleted_at', 'is', null)
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new MealRepositoryError({
              message: `Failed to find meal with id ${id}`,
              cause: error
            })
        }),

      update: (id, payload) =>
        Effect.tryPromise({
          try: () =>
            db
              .updateTable('meals')
              .set(payload)
              .where('id', '=', id)
              .where('deleted_at', 'is', null)
              .returningAll()
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new MealRepositoryError({
              message: `Failed to update meal with id ${id}`,
              cause: error
            })
        }),

      delete: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .updateTable('meals')
              .set({ deleted_at: Date.now() })
              .where('id', '=', id)
              .where('deleted_at', 'is', null)
              .returningAll()
              .executeTakeFirst()
              .then(Option.fromNullable),
          catch: (error) =>
            new MealRepositoryError({
              message: `Failed to delete meal with id ${id}`,
              cause: error
            })
        })
    })
  })
)
