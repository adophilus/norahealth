import type {
  Allergen,
  FitnessGoal,
  FoodClass,
  Meal
} from '@nora-health/domain'
import { Context, type Effect, type Option } from 'effect'
import type { MealServiceError } from './error'

export type MealInsertable = Omit<
  Meal,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
>

export type MealUpdateable = Partial<{
  name: string
  description: string
  food_classes: FoodClass[]
  calories: number
  protein: number
  carbs: number
  fat: number
  prep_time_minutes: number
  cover_image_id: string
  allergens: Allergen[]
  is_prepackaged: boolean
  fitness_goals: FitnessGoal[]
}>

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
    create(meal: MealInsertable): Effect.Effect<Meal, MealServiceError>
    findById(id: string): Effect.Effect<Option.Option<Meal>, MealServiceError>
    findAll(): Effect.Effect<Array<Meal>, MealServiceError>
    update(
      id: string,
      updates: MealUpdateable
    ): Effect.Effect<Meal, MealServiceError>
    delete(id: string): Effect.Effect<void, MealServiceError>

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
