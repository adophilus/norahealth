import type { BodyTarget, FitnessGoal, Injury } from '@nora-health/domain'
import { Context, type Effect } from 'effect'
import type { DailyWorkoutPlan, Workout } from '@/types'
import type {
  DailyWorkoutPlanServiceError,
  DailyWorkoutPlanServiceNotFoundError,
  DailyWorkoutPlanServiceValidationError
} from './error'

export class DailyWorkoutPlanService extends Context.Tag(
  'DailyWorkoutPlanService'
)<
  DailyWorkoutPlanService,
  {
    create(
      payload: DailyWorkoutPlan.Insertable
    ): Effect.Effect<DailyWorkoutPlan.Selectable, DailyWorkoutPlanServiceError>
    findById(
      id: string
    ): Effect.Effect<
      DailyWorkoutPlan.Selectable,
      DailyWorkoutPlanServiceError | DailyWorkoutPlanServiceNotFoundError
    >
    findByUserIdAndDate(
      userId: string,
      date: string
    ): Effect.Effect<
      DailyWorkoutPlan.Selectable,
      DailyWorkoutPlanServiceError | DailyWorkoutPlanServiceNotFoundError
    >
    findByUserIdAndDateRange(
      userId: string,
      startDate: string,
      endDate: string
    ): Effect.Effect<
      DailyWorkoutPlan.Selectable[],
      DailyWorkoutPlanServiceError
    >
    update(
      id: string,
      payload: DailyWorkoutPlan.Updateable
    ): Effect.Effect<
      DailyWorkoutPlan.Selectable,
      DailyWorkoutPlanServiceError | DailyWorkoutPlanServiceNotFoundError
    >
    delete(
      id: string
    ): Effect.Effect<
      void,
      DailyWorkoutPlanServiceError | DailyWorkoutPlanServiceNotFoundError
    >
    generateWeeklyPlan(
      userId: string,
      healthProfile: {
        fitness_goals: readonly FitnessGoal[]
        injuries: readonly Injury[]
        body_targets: readonly BodyTarget[]
      }
    ): Effect.Effect<
      DailyWorkoutPlan.Selectable[],
      DailyWorkoutPlanServiceError | DailyWorkoutPlanServiceValidationError
    >
    selectWorkoutsForDay(
      availableWorkouts: Workout.Selectable[],
      fitnessGoals: FitnessGoal[]
    ): Effect.Effect<
      {
        morning_workout: Workout.Selectable | null
        afternoon_workout: Workout.Selectable | null
        evening_workout: Workout.Selectable | null
      },
      DailyWorkoutPlanServiceError
    >
  }
>() {}
