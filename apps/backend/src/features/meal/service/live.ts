import { Allergen, FitnessGoal, FoodClass, Meal } from '@nora-health/domain'
import type { Meal as TMeal } from '@/types'
import { Layer, Effect, Schema } from 'effect'
import { MealRepository } from '../repository'
import { MealServiceError, MealServiceNotFoundError } from './error'
import { MealService, type NutritionSummary } from './interface'
import { ulid } from 'ulidx'

export const MealServiceLive = Layer.effect(
  MealService,
  Effect.gen(function* () {
    const repository = yield* MealRepository

    const toDomain = (row: TMeal.Selectable) =>
      Effect.gen(function* () {
        const foodClasses = yield* Effect.try(() =>
          JSON.parse(row.food_classes)
        ).pipe(Effect.flatMap(Schema.decodeUnknown(Schema.Array(FoodClass))))

        const allergens = yield* Effect.try(() =>
          JSON.parse(row.allergens)
        ).pipe(Effect.flatMap(Schema.decodeUnknown(Schema.Array(Allergen))))

        const fitnessGoals = yield* Effect.try(() =>
          JSON.parse(row.fitness_goals)
        ).pipe(Effect.flatMap(Schema.decodeUnknown(Schema.Array(FitnessGoal))))

        return Meal.make({
          ...row,
          food_classes: foodClasses,
          allergens,
          fitness_goals: fitnessGoals
        })
      }).pipe(
        Effect.mapError(
          (error) =>
            new MealServiceError({
              message: 'Failed to decode meal',
              cause: error
            })
        )
      )

    return MealService.of({
      create: (payload) =>
        repository
          .create({
            ...payload,
            id: ulid(),
            food_classes: JSON.stringify(payload.food_classes),
            allergens: JSON.stringify(payload.allergens),
            fitness_goals: JSON.stringify(payload.fitness_goals)
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
        MealRepository.pipe(Effect.flatMap((repo) => repo.findById(id))),

      findAll: () =>
        MealRepository.pipe(Effect.flatMap((repo) => repo.findAll())),

      update: (id, updates) =>
        Effect.gen(function* () {
          return yield* MealRepository.pipe(
            Effect.flatMap((repo) => repo.update(id, updates))
          )
        }),

      delete: (id) =>
        Effect.gen(function* () {
          const existingMeal = yield* MealRepository.pipe(
            Effect.flatMap((repo) => repo.findById(id))
          )

          if (existingMeal._tag === 'None') {
            return yield* new MealServiceNotFoundError({})
          }

          return yield* MealRepository.pipe(
            Effect.flatMap((repo) => repo.delete(id))
          )
        }),

      findByFitnessGoals: (goals) =>
        MealRepository.pipe(
          Effect.flatMap((repo) => repo.findByFitnessGoals(goals))
        ),

      findByAllergensExcluded: (excludedAllergens) =>
        MealRepository.pipe(
          Effect.flatMap((repo) =>
            repo.findByAllergensExcluded(excludedAllergens)
          )
        ),

      findByFoodClasses: (foodClasses) =>
        MealRepository.pipe(
          Effect.flatMap((repo) => repo.findByFoodClasses(foodClasses))
        ),

      findByGoalAndAllergens: (goals, excludedAllergens) =>
        MealRepository.pipe(
          Effect.flatMap((repo) =>
            repo.findByGoalAndAllergens(goals, excludedAllergens)
          )
        ),

      getMealNutritionSummary: (mealIds) =>
        Effect.gen(function* () {
          const repo = yield* MealRepository

          const mealsWithNutrition = []

          for (const id of mealIds) {
            const mealResult = yield* repo.findById(id)

            if (mealResult._tag === 'Some') {
              const meal = mealResult.value

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
        })
    })
  })
)
