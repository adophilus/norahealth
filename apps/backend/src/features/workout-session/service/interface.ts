import type { WorkoutSession } from '@nora-health/domain'
import { Context, type Effect } from 'effect'
import type { WorkoutSession as TWorkoutSession } from '@/types'
import type {
  WorkoutSessionServiceError,
  WorkoutSessionServiceNotFoundError
} from './error'

export class WorkoutSessionService extends Context.Tag('WorkoutSessionService')<
  WorkoutSessionService,
  {
    create(
      payload: Omit<
        TWorkoutSession.Insertable,
        'id' | 'updated_at' | 'deleted_at'
      >
    ): Effect.Effect<WorkoutSession, WorkoutSessionServiceError>
    findById(
      id: string
    ): Effect.Effect<
      WorkoutSession,
      WorkoutSessionServiceNotFoundError | WorkoutSessionServiceError
    >
    findAll(): Effect.Effect<Array<WorkoutSession>, WorkoutSessionServiceError>
    update(
      id: string,
      payload: Omit<
        TWorkoutSession.Updateable,
        'id' | 'updated_at' | 'deleted_at'
      >
    ): Effect.Effect<
      WorkoutSession,
      WorkoutSessionServiceNotFoundError | WorkoutSessionServiceError
    >
    delete(
      id: string
    ): Effect.Effect<
      void,
      WorkoutSessionServiceNotFoundError | WorkoutSessionServiceError
    >

    findByUserId(
      userId: string
    ): Effect.Effect<Array<WorkoutSession>, WorkoutSessionServiceError>

    findByWorkoutId(
      workoutId: string
    ): Effect.Effect<Array<WorkoutSession>, WorkoutSessionServiceError>

    findByUserIdAndWorkoutId(
      userId: string,
      workoutId: string
    ): Effect.Effect<Array<WorkoutSession>, WorkoutSessionServiceError>

    completeWorkoutSession(
      sessionId: string,
      sorenessLevel?: string,
      actualDuration?: number,
      notes?: string
    ): Effect.Effect<
      WorkoutSession,
      WorkoutSessionServiceNotFoundError | WorkoutSessionServiceError
    >
  }
>() {}
