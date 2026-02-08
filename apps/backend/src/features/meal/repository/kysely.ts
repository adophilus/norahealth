import { Effect, Layer, Option } from 'effect'
import { KyselyClient } from '@/features/database/kysely'
import { MealRepositoryError } from './error'
import { MealRepository } from './interface'

export const KyselyMealRepositoryLive = Layer.effect(
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

              .where('fitness_goals', 'like', `%${goals.join(',')}%`)
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

              .where((eb) =>
                eb.or(
                  excludedAllergens.map((allergen) =>
                    eb('allergens', 'not like', `%${allergen}%`)
                  )
                )
              )
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

              .where((eb) =>
                eb.or(
                  foodClasses.map((foodClass) =>
                    eb('food_classes', 'like', `%${foodClass}%`)
                  )
                )
              )
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

              .where('fitness_goals', 'like', `%${goals.join(',')}%`)
              .where((eb) =>
                eb.or(
                  excludedAllergens.map((allergen) =>
                    eb('allergens', 'not like', `%${allergen}%`)
                  )
                )
              )
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
          try: () => {
            const serializedPayload = { ...payload }

            // Serialize complex fields to JSON strings
            if (payload.food_classes && Array.isArray(payload.food_classes)) {
              serializedPayload.food_classes = JSON.stringify(
                payload.food_classes
              )
            }

            if (payload.allergens && Array.isArray(payload.allergens)) {
              serializedPayload.allergens = JSON.stringify(payload.allergens)
            }

            if (payload.fitness_goals && Array.isArray(payload.fitness_goals)) {
              serializedPayload.fitness_goals = JSON.stringify(
                payload.fitness_goals
              )
            }

            return db
              .updateTable('meals')
              .set(serializedPayload)
              .where('id', '=', id)

              .returningAll()
              .executeTakeFirst()
              .then(Option.fromNullable)
          },
          catch: (error) =>
            new MealRepositoryError({
              message: `Failed to update meal with id ${id}`,
              cause: error
            })
        }),

      delete: (id) =>
        Effect.tryPromise({
          try: async () => {
            const meal = await db
              .selectFrom('meals')
              .selectAll()
              .where('id', '=', id)
              .executeTakeFirst()

            if (!meal) {
              return Option.none()
            }

            await db.deleteFrom('meals').where('id', '=', id).execute()

            return Option.some(meal)
          },
          catch: (error) =>
            new MealRepositoryError({
              message: `Failed to delete meal with id ${id}`,
              cause: error
            })
        })
    })
  })
)
