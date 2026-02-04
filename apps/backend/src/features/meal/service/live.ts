import type { Meal } from '@nora-health/domain'
import { Effect, Option } from 'effect'
import { MealRepository } from '../../meal/repository'
import {
  MealServiceError,
  MealServiceNotFoundError,
  MealServiceValidationError
} from './error'
import {
  type MealInsertable,
  MealService,
  type MealUpdateable,
  type NutritionSummary
} from './interface'

export const MealServiceLive = Effect.sync(() => {
  return MealService.of({
    create: (meal) =>
      Effect.gen(function* () {
        yield* validateMealInsertable(meal)

        return yield* MealRepository.pipe(
          Effect.flatMap((repo) => repo.create(meal))
        )
      }),

    findById: (id) =>
      MealRepository.pipe(Effect.flatMap((repo) => repo.findById(id))),

    findAll: () =>
      MealRepository.pipe(Effect.flatMap((repo) => repo.findAll())),

    update: (id, updates) =>
      Effect.gen(function* () {
        yield* validateMealUpdateable(updates)

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

const validateMealInsertable = (meal: MealInsertable) =>
  Effect.gen(function* () {
    if (!meal.name || meal.name.trim().length === 0) {
      return yield* new MealServiceValidationError({
        message: 'Meal name is required',
        field: 'name'
      })
    }

    if (meal.name.length > 200) {
      return yield* new MealServiceValidationError({
        message: 'Meal name must be less than 200 characters',
        field: 'name'
      })
    }

    if (meal.calories && meal.calories < 0) {
      return yield* new MealServiceValidationError({
        message: 'Calories must be positive',
        field: 'calories'
      })
    }

    if (
      (meal.protein && meal.protein < 0) ||
      (meal.carbs && meal.carbs < 0) ||
      (meal.fat && meal.fat < 0)
    ) {
      return yield* new MealServiceValidationError({
        message: 'Nutrition values must be positive',
        field: 'nutrition'
      })
    }

    return void 0
  })

const validateMealUpdateable = (updates: MealUpdateable) =>
  Effect.gen(function* () {
    if (updates.name !== undefined) {
      if (updates.name.trim().length === 0) {
        return yield* new MealServiceValidationError({
          message: 'Meal name cannot be empty',
          field: 'name'
        })
      }

      if (updates.name.length > 200) {
        return yield* new MealServiceValidationError({
          message: 'Meal name must be less than 200 characters',
          field: 'name'
        })
      }
    }

    if (updates.calories !== undefined && updates.calories < 0) {
      return yield* new MealServiceValidationError({
        message: 'Calories must be positive',
        field: 'calories'
      })
    }

    if (
      (updates.protein !== undefined && updates.protein < 0) ||
      (updates.carbs !== undefined && updates.carbs < 0) ||
      (updates.fat !== undefined && updates.fat < 0)
    ) {
      return yield* new MealServiceValidationError({
        message: 'Nutrition values must be positive',
        field: 'nutrition'
      })
    }

    return void 0
  })
