import type { Meal } from '@nora-health/domain'
import { generateId } from '@nora-health/domain/Id'
import { Effect, Option } from 'effect'
import { KyselyClient } from '../../../database/kysely'
import { MealRepository, MealRepositoryError } from './interface'

export const MealRepositoryLive = Effect.sync(() => {
  return MealRepository.of({
    create: (payload) =>
      Effect.gen(function* () {
        const db = yield* KyselyClient

        return yield* Effect.tryPromise({
          try: () =>
            db
              .insertInto('meals')
              .values({
                id: generateId(),
                ...payload,
                food_classes: JSON.stringify(payload.food_classes),
                allergens: JSON.stringify(payload.allergens),
                fitness_goals: JSON.stringify(payload.fitness_goals),
                created_at: Date.now()
              })
              .returningAll()
              .executeTakeFirstOrThrow(),
          catch: (error) =>
            new MealRepositoryError({
              message: 'Failed to create meal',
              cause: error
            })
        }).pipe(Effect.map(parseMeal))
      }),

    findByFitnessGoals: (goals) =>
      Effect.gen(function* () {
        const db = yield* KyselyClient

        return yield* Effect.tryPromise({
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
        })
          .pipe(Effect.map(Array.from))
          .pipe(
            Effect.map((meals) =>
              meals.filter((meal) => {
                const mealGoals = JSON.parse(meal.fitness_goals)
                return goals.some((goal) => mealGoals.includes(goal))
              })
            )
          )
          .pipe(Effect.map(Effect.map(parseMeal)))
      }),

    findByAllergensExcluded: (excludedAllergens) =>
      Effect.gen(function* () {
        const db = yield* KyselyClient

        return yield* Effect.tryPromise({
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
        })
          .pipe(Effect.map(Array.from))
          .pipe(
            Effect.map((meals) =>
              meals.filter((meal) => {
                const mealAllergens = JSON.parse(meal.allergens)
                return !excludedAllergens.some((allergen) =>
                  mealAllergens.includes(allergen)
                )
              })
            )
          )
          .pipe(Effect.map(Effect.map(parseMeal)))
      }),

    findByFoodClasses: (foodClasses) =>
      Effect.gen(function* () {
        const db = yield* KyselyClient

        return yield* Effect.tryPromise({
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
        })
          .pipe(Effect.map(Array.from))
          .pipe(
            Effect.map((meals) =>
              meals.filter((meal) => {
                const mealFoodClasses = JSON.parse(meal.food_classes)
                return foodClasses.some((fc) => mealFoodClasses.includes(fc))
              })
            )
          )
          .pipe(Effect.map(Effect.map(parseMeal)))
      }),

    findByGoalAndAllergens: (goals, excludedAllergens) =>
      Effect.gen(function* () {
        const db = yield* KyselyClient

        return yield* Effect.tryPromise({
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
        })
          .pipe(Effect.map(Array.from))
          .pipe(
            Effect.map((meals) =>
              meals.filter((meal) => {
                const mealGoals = JSON.parse(meal.fitness_goals)
                const mealAllergens = JSON.parse(meal.allergens)

                const matchesGoals =
                  goals.length === 0 ||
                  goals.some((goal) => mealGoals.includes(goal))

                const excludesAllergens = !excludedAllergens.some((allergen) =>
                  mealAllergens.includes(allergen)
                )

                return matchesGoals && excludesAllergens
              })
            )
          )
          .pipe(Effect.map(Effect.map(parseMeal)))
      }),

    findAll: () =>
      Effect.gen(function* () {
        const db = yield* KyselyClient

        return yield* Effect.tryPromise({
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
        })
          .pipe(Effect.map(Array.from))
          .pipe(Effect.map(Effect.map(parseMeal)))
      }),

    findById: (id) =>
      Effect.gen(function* () {
        const db = yield* KyselyClient

        return yield* Effect.tryPromise({
          try: () =>
            db
              .selectFrom('meals')
              .selectAll()
              .where('id', '=', id)
              .where('deleted_at', 'is', null)
              .executeTakeFirst(),
          catch: (error) =>
            new MealRepositoryError({
              message: `Failed to find meal with id ${id}`,
              cause: error
            })
        })
          .pipe(Effect.map(Option.fromNullable))
          .pipe(Effect.map(Option.map(parseMeal)))
      })
  })
})

const parseMeal = (record: any): Meal => ({
  ...record,
  food_classes: JSON.parse(record.food_classes || '[]'),
  allergens: JSON.parse(record.allergens || '[]'),
  fitness_goals: JSON.parse(record.fitness_goals || '[]')
})
