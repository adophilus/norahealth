import { Context, type Effect, type Option } from 'effect'
import type { WorkoutSession } from '@/types'
import type { WorkoutSessionRepositoryError } from './error'

export class WorkoutSessionRepository extends Context.Tag(
  'WorkoutSessionRepository'
)<
  WorkoutSessionRepository,
  {
    create(
      payload: WorkoutSession.Insertable
    ): Effect.Effect<WorkoutSession.Selectable, WorkoutSessionRepositoryError>
    update(
      id: string,
      payload: WorkoutSession.Updateable
    ): Effect.Effect<
      Option.Option<WorkoutSession.Selectable>,
      WorkoutSessionRepositoryError
    >
    delete(
      id: string
    ): Effect.Effect<
      Option.Option<WorkoutSession.Selectable>,
      WorkoutSessionRepositoryError
    >
    findByUserId(
      userId: string
    ): Effect.Effect<WorkoutSession.Selectable[], WorkoutSessionRepositoryError>
    findByWorkoutId(
      workoutId: string
    ): Effect.Effect<WorkoutSession.Selectable[], WorkoutSessionRepositoryError>
    findByUserIdAndWorkoutId(
      userId: string,
      workoutId: string
    ): Effect.Effect<WorkoutSession.Selectable[], WorkoutSessionRepositoryError>
    findAll(): Effect.Effect<
      WorkoutSession.Selectable[],
      WorkoutSessionRepositoryError
    >
    findById(
      id: string
    ): Effect.Effect<
      Option.Option<WorkoutSession.Selectable>,
      WorkoutSessionRepositoryError
    >
  }
>() {}
