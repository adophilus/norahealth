import type { BodyTarget, FitnessGoal, Injury } from '@nora-health/domain'
import { Context, type Effect, type Option } from 'effect'
import type { Workout } from '@/types'
import type { WorkoutRepositoryError } from './error'

export class WorkoutRepository extends Context.Tag('WorkoutRepository')<
  WorkoutRepository,
  {
    create(
      payload: Workout.Insertable
    ): Effect.Effect<Workout.Selectable, WorkoutRepositoryError>
    update(
      id: string,
      payload: Workout.Updateable
    ): Effect.Effect<Option.Option<Workout.Selectable>, WorkoutRepositoryError>
    delete(
      id: string
    ): Effect.Effect<Option.Option<Workout.Selectable>, WorkoutRepositoryError>
    findByFitnessGoals(
      goals: FitnessGoal[]
    ): Effect.Effect<Workout.Selectable[], WorkoutRepositoryError>
    findByBodyTargets(
      targets: BodyTarget[]
    ): Effect.Effect<Workout.Selectable[], WorkoutRepositoryError>
    findByInjuriesExcluded(
      excludedInjuries: Injury[]
    ): Effect.Effect<Workout.Selectable[], WorkoutRepositoryError>
    findByGoalAndBodyTargets(
      goals: FitnessGoal[],
      targets: BodyTarget[]
    ): Effect.Effect<Workout.Selectable[], WorkoutRepositoryError>
    findAll(): Effect.Effect<Workout.Selectable[], WorkoutRepositoryError>
    findById(
      id: string
    ): Effect.Effect<Option.Option<Workout.Selectable>, WorkoutRepositoryError>
  }
>() {}
