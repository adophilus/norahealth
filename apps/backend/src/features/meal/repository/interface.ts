import type {
  Allergen,
  FitnessGoal,
  FoodClass,
  Meal
} from '@nora-health/domain'
import { Context, type Effect, type Option } from 'effect'
import type { MealRepositoryError } from './error'

export class MealRepository extends Context.Tag('MealRepository')<
  MealRepository,
  {
    create(payload: MealInsertable): Effect.Effect<Meal, MealRepositoryError>
    findByFitnessGoals(
      goals: FitnessGoal[]
    ): Effect.Effect<Array<Meal>, MealRepositoryError>
    findByAllergensExcluded(
      excludedAllergens: Allergen[]
    ): Effect.Effect<Array<Meal>, MealRepositoryError>
    findByFoodClasses(
      foodClasses: FoodClass[]
    ): Effect.Effect<Array<Meal>, MealRepositoryError>
    findByGoalAndAllergens(
      goals: FitnessGoal[],
      excludedAllergens: Allergen[]
    ): Effect.Effect<Array<Meal>, MealRepositoryError>
    findAll(): Effect.Effect<Array<Meal>, MealRepositoryError>
    findById(
      id: string
    ): Effect.Effect<Option.Option<Meal>, MealRepositoryError>
  }
>() {}

export type MealInsertable = Omit<
  Meal,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
>
