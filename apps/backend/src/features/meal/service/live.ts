import { Allergen, FitnessGoal, FoodClass, Meal } from '@nora-health/domain'
import { Effect, Layer, Option, Schema } from 'effect'
import { ulid } from 'ulidx'
import type { Meal as TMeal } from '@/types'
import { MealRepository } from '../repository'
import { MealServiceError, MealServiceNotFoundError } from './error'
import { MealService, type NutritionSummary } from './interface'

export const MealServiceLive = Layer.effect(
  MealService,
  Effect.gen(function* () {
    const repository = yield* MealRepository

    const toDomain = (row: TMeal.Selectable) =>
      Effect.try({
        try: () => {
          const foodClasses = JSON.parse(row.food_classes)
          const allergens = JSON.parse(row.allergens)
          const fitnessGoals = JSON.parse(row.fitness_goals)

          return Meal.make({
            ...row,
            food_classes: Schema.decodeUnknownSync(Schema.Array(FoodClass))(
              foodClasses
            ),
            allergens: Schema.decodeUnknownSync(Schema.Array(Allergen))(
              allergens
            ),
            fitness_goals: Schema.decodeUnknownSync(Schema.Array(FitnessGoal))(
              fitnessGoals
            )
          })
        },
        catch: (error) =>
          new MealServiceError({
            message: 'Failed to decode meal',
            cause: error
          })
      })

    const toDomainArray = (rows: TMeal.Selectable[]) =>
      Effect.all(rows.map(toDomain))

    const serializeComplexFields = (payload: any) => {
      const result: any = {}

      if (payload.food_classes) {
        result.food_classes = JSON.stringify(payload.food_classes)
      }

      if (payload.allergens) {
        result.allergens = JSON.stringify(payload.allergens)
      }

      if (payload.fitness_goals) {
        result.fitness_goals = JSON.stringify(payload.fitness_goals)
      }

      return result
    }

    return MealService.of({
      create: (payload) =>
        repository
          .create({
            ...payload,
            id: ulid(),
            ...serializeComplexFields(payload)
          })
          .pipe(
            Effect.flatMap(toDomain),
            Effect.catchTags({
              MealRepositoryError: (error) =>
                new MealServiceError({
                  message: error.message,
                  cause: error
                })
            })
          ),

      findById: (id) =>
        repository.findById(id).pipe(
          Effect.flatMap(
            Option.match({
              onSome: Effect.succeed,
              onNone: () => Effect.fail(new MealServiceNotFoundError({}))
            })
          ),
          Effect.flatMap(toDomain),
          Effect.catchTags({
            MealRepositoryError: (error) =>
              new MealServiceError({
                message: error.message,
                cause: error
              })
          })
        ),

      findAll: () =>
        repository.findAll().pipe(
          Effect.flatMap(toDomainArray),
          Effect.catchTags({
            MealRepositoryError: (error) =>
              new MealServiceError({
                message: error.message,
                cause: error
              })
          })
        ),

      update: (id, updates) =>
        repository
          .update(id, {
            ...updates,
            ...serializeComplexFields(updates)
          })
          .pipe(
            Effect.flatMap(
              Option.match({
                onSome: toDomain,
                onNone: () =>
                  Effect.fail(
                    new MealServiceError({
                      message: `Meal with id ${id} not found for update`
                    })
                  )
              })
            ),
            Effect.catchTags({
              MealRepositoryError: (error) =>
                new MealServiceError({
                  message: error.message,
                  cause: error
                })
            })
          ),

      delete: (id) =>
        repository.findById(id).pipe(
          Effect.flatMap(
            Option.match({
              onSome: () => Effect.succeed(undefined),
              onNone: () => Effect.fail(new MealServiceNotFoundError({}))
            })
          ),
          Effect.flatMap(() => repository.delete(id)),
          Effect.catchTags({
            MealRepositoryError: (error) =>
              new MealServiceError({
                message: error.message,
                cause: error
              })
          })
        ),

      findByFitnessGoals: (goals) =>
        repository.findByFitnessGoals(goals).pipe(
          Effect.flatMap(toDomainArray),
          Effect.catchTags({
            MealRepositoryError: (error) =>
              new MealServiceError({
                message: error.message,
                cause: error
              })
          })
        ),

      findByAllergensExcluded: (excludedAllergens) =>
        repository.findByAllergensExcluded(excludedAllergens).pipe(
          Effect.flatMap(toDomainArray),
          Effect.catchTags({
            MealRepositoryError: (error) =>
              new MealServiceError({
                message: error.message,
                cause: error
              })
          })
        ),

      findByFoodClasses: (foodClasses) =>
        repository.findByFoodClasses(foodClasses).pipe(
          Effect.flatMap(toDomainArray),
          Effect.catchTags({
            MealRepositoryError: (error) =>
              new MealServiceError({
                message: error.message,
                cause: error
              })
          })
        ),

      findByGoalAndAllergens: (goals, excludedAllergens) =>
        repository.findByGoalAndAllergens(goals, excludedAllergens).pipe(
          Effect.flatMap(toDomainArray),
          Effect.catchTags({
            MealRepositoryError: (error) =>
              new MealServiceError({
                message: error.message,
                cause: error
              })
          })
        ),

      getMealNutritionSummary: (mealIds) =>
        Effect.all(mealIds.map((id) => repository.findById(id))).pipe(
          Effect.map((mealOptions) => {
            const mealsWithNutrition = []

            for (const mealOption of mealOptions) {
              if (mealOption._tag === 'Some') {
                const meal = mealOption.value

                if (meal.calories && meal.protein && meal.carbs && meal.fat) {
                  mealsWithNutrition.push(meal)
                }
              }
            }

            const summary: NutritionSummary = {
              totalCalories: mealsWithNutrition.reduce(
                (sum, meal) => sum + meal.calories!,
                0
              ),
              totalProtein: mealsWithNutrition.reduce(
                (sum, meal) => sum + meal.protein!,
                0
              ),
              totalCarbs: mealsWithNutrition.reduce(
                (sum, meal) => sum + meal.carbs!,
                0
              ),
              totalFat: mealsWithNutrition.reduce(
                (sum, meal) => sum + meal.fat!,
                0
              ),
              mealCount: mealsWithNutrition.length
            }

            return summary
          }),
          Effect.catchTags({
            MealRepositoryError: (error) =>
              new MealServiceError({
                message: error.message,
                cause: error
              })
          })
        )
    })
  })
)
