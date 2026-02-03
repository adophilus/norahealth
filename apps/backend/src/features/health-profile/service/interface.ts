import type { HealthProfile } from '@nora-health/domain'
import { Context, Data, type Effect } from 'effect'

export interface HealthProfileService {
  create(
    healthProfile: Omit<HealthProfile, 'id' | 'created_at' | 'updated_at'>
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
    healthProfile: Partial<HealthProfile>
  ): Effect.Effect<
    HealthProfile,
    HealthProfileServiceError | HealthProfileServiceNotFoundError,
    never
  >
  delete(
    id: string
  ): Effect.Effect<
    void,
    HealthProfileServiceError | HealthProfileServiceNotFoundError,
    never
  >
}

export class HealthProfileServiceError extends Data.TaggedError(
  'HealthProfileServiceError'
)<{ readonly message: string; readonly cause?: unknown }> {}

export class HealthProfileServiceNotFoundError extends Data.TaggedError(
  'HealthProfileServiceNotFoundError'
)<{ readonly id: string; readonly cause?: unknown }> {}

export const HealthProfileService = Context.GenericTag<HealthProfileService>(
  'HealthProfileService'
)
