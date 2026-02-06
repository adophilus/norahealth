import type { Allergen, FitnessGoal, FoodClass } from '@nora-health/domain'
import { Context, type Effect, type Option } from 'effect'
import type { MealRepositoryError } from './error'
import type { Meal } from '@/types'

export class MealRepository extends Context.Tag('MealRepository')<
  MealRepository,
  {
    create(
      payload: Meal.Insertable
    ): Effect.Effect<Meal.Selectable, MealRepositoryError>
    findByFitnessGoals(
      goals: FitnessGoal[]
    ): Effect.Effect<Meal.Selectable[], MealRepositoryError>
    findByAllergensExcluded(
      excludedAllergens: Allergen[]
    ): Effect.Effect<Meal.Selectable[], MealRepositoryError>
    findByFoodClasses(
      foodClasses: FoodClass[]
    ): Effect.Effect<Meal.Selectable[], MealRepositoryError>
    findByGoalAndAllergens(
      goals: FitnessGoal[],
      excludedAllergens: Allergen[]
    ): Effect.Effect<Meal.Selectable[], MealRepositoryError>
    findAll(): Effect.Effect<Meal.Selectable[], MealRepositoryError>
    findById(
      id: string
    ): Effect.Effect<Option.Option<Meal.Selectable>, MealRepositoryError>
  }
>() {}
