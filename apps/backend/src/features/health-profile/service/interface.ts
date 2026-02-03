import type { HealthProfile } from '@nora-health/domain'
import type { HealthProfile as THealthProfile } from '@/types'
import { Context, type Effect } from 'effect'
import type {
  HealthProfileServiceError,
  HealthProfileServiceNotFoundError
} from './error'

type ComplexKeys =
  | 'injuries'
  | 'medical_conditions'
  | 'fitness_goals'
  | 'allergies'
  | 'location'

type ComplexFields = {
  injuries: HealthProfile['injuries']
  medical_conditions: HealthProfile['medical_conditions']
  fitness_goals: HealthProfile['fitness_goals']
  allergies: HealthProfile['allergies']
  location: HealthProfile['location']
}

export class HealthProfileService extends Context.Tag('HealthProfileService')<
  HealthProfileService,
  {
    create(
      payload: Omit<THealthProfile.Insertable, 'id' | ComplexKeys> &
        ComplexFields
    ): Effect.Effect<HealthProfile, HealthProfileServiceError, never>

    findById(
      id: string
    ): Effect.Effect<
      HealthProfile,
      HealthProfileServiceError | HealthProfileServiceNotFoundError,
      never
    >

    findByUserId(
      userId: string
    ): Effect.Effect<
      HealthProfile,
      HealthProfileServiceError | HealthProfileServiceNotFoundError,
      never
    >
    update(
      id: string,
      payload: Omit<THealthProfile.Updateable, ComplexKeys> &
        Partial<ComplexFields>
    ): Effect.Effect<
      HealthProfile,
      HealthProfileServiceError | HealthProfileServiceNotFoundError,
      never
    >
    delete(
      id: string
    ): Effect.Effect<
      HealthProfile,
      HealthProfileServiceError | HealthProfileServiceNotFoundError,
      never
    >
  }
>() {}
