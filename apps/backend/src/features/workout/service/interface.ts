import type {
  BodyTarget,
  FitnessGoal,
  Injury,
  Workout
} from '@nora-health/domain'
import { Context, type Effect } from 'effect'
import type { Workout as TWorkout } from '@/types'
import type { WorkoutServiceError, WorkoutServiceNotFoundError } from './error'

type ComplexKeys = 'body_targets' | 'contraindications' | 'fitness_goals'

type ComplexFields = {
  body_targets: Workout['body_targets']
  contraindications: Workout['contraindications']
  fitness_goals: Workout['fitness_goals']
}

export class WorkoutService extends Context.Tag('WorkoutService')<
  WorkoutService,
  {
    create(
      payload: Omit<
        TWorkout.Insertable,
        'id' | 'updated_at' | 'deleted_at' | ComplexKeys
      > &
        ComplexFields
    ): Effect.Effect<Workout, WorkoutServiceError>
    findById(
      id: string
    ): Effect.Effect<Workout, WorkoutServiceNotFoundError | WorkoutServiceError>
    findAll(): Effect.Effect<Array<Workout>, WorkoutServiceError>
    update(
      id: string,
      payload: Omit<
        TWorkout.Updateable,
        'id' | 'updated_at' | 'deleted_at' | ComplexKeys
      > &
        Partial<ComplexFields>
    ): Effect.Effect<Workout, WorkoutServiceNotFoundError | WorkoutServiceError>
    delete(
      id: string
    ): Effect.Effect<void, WorkoutServiceNotFoundError | WorkoutServiceError>

    findByFitnessGoals(
      goals: FitnessGoal[]
    ): Effect.Effect<Array<Workout>, WorkoutServiceError>

    findByBodyTargets(
      targets: BodyTarget[]
    ): Effect.Effect<Array<Workout>, WorkoutServiceError>

    findByInjuriesExcluded(
      excludedInjuries: Injury[]
    ): Effect.Effect<Array<Workout>, WorkoutServiceError>

    findByGoalAndBodyTargets(
      goals: FitnessGoal[],
      targets: BodyTarget[]
    ): Effect.Effect<Array<Workout>, WorkoutServiceError>

    getWorkoutsForUserProfile(
      fitnessGoals: FitnessGoal[],
      injuries: Injury[],
      bodyTargets: BodyTarget[]
    ): Effect.Effect<Array<Workout>, WorkoutServiceError>
  }
>() {}
