import type {
  Allergen,
  FitnessGoal,
  FoodClass,
  Meal
} from '@nora-health/domain'
import { Context, type Effect } from 'effect'
import type { MealServiceError, MealServiceNotFoundError } from './error'
import type { Meal as TMeal } from '@/types'

type ComplexKeys = 'food_classes' | 'allergens' | 'fitness_goals'

type ComplexFields = {
  food_classes: Meal['food_classes']
  allergens: Meal['allergens']
  fitness_goals: Meal['fitness_goals']
}

export type NutritionSummary = {
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  mealCount: number
}

export class MealService extends Context.Tag('MealService')<
  MealService,
  {
    create(
      payload: Omit<
        TMeal.Insertable,
        'id' | 'created_at' | 'updated_at' | 'deleted_at' | ComplexKeys
      > &
        ComplexFields
    ): Effect.Effect<Meal, MealServiceError>
    findById(
      id: string
    ): Effect.Effect<Meal, MealServiceNotFoundError | MealServiceError>
    findAll(): Effect.Effect<Array<Meal>, MealServiceError>
    update(
      id: string,
      payload: Omit<
        TMeal.Updateable,
        'id' | 'created_at' | 'updated_at' | 'deleted_at' | ComplexKeys
      > &
        Partial<ComplexFields>
    ): Effect.Effect<Meal, MealServiceError>
    delete(
      id: string
    ): Effect.Effect<void, MealServiceNotFoundError | MealServiceError>

    findByFitnessGoals(
      goals: FitnessGoal[]
    ): Effect.Effect<Array<Meal>, MealServiceError>

    findByAllergensExcluded(
      excludedAllergens: Allergen[]
    ): Effect.Effect<Array<Meal>, MealServiceError>

    findByFoodClasses(
      foodClasses: FoodClass[]
    ): Effect.Effect<Array<Meal>, MealServiceError>

    findByGoalAndAllergens(
      goals: FitnessGoal[],
      excludedAllergens: Allergen[]
    ): Effect.Effect<Array<Meal>, MealServiceError>

    getMealNutritionSummary(
      mealIds: string[]
    ): Effect.Effect<NutritionSummary, MealServiceError>
  }
>() {}
