import type { HealthProfile } from '@nora-health/domain'
import { Context, Data, type Effect } from 'effect'

export interface HealthProfileRepository {
  create(
    healthProfile: Omit<HealthProfile, 'id' | 'created_at' | 'updated_at'>
  ): Effect.Effect<HealthProfile, HealthProfileRepositoryError, never>
  findById(
    id: string
  ): Effect.Effect<
    HealthProfile,
    HealthProfileRepositoryError | HealthProfileRepositoryNotFoundError,
    never
  >
  findByUserId(
    userId: string
  ): Effect.Effect<
    HealthProfile,
    HealthProfileRepositoryError | HealthProfileRepositoryNotFoundError,
    never
  >
  update(
    id: string,
    healthProfile: Partial<HealthProfile>
  ): Effect.Effect<
    HealthProfile,
    HealthProfileRepositoryError | HealthProfileRepositoryNotFoundError,
    never
  >
  delete(
    id: string
  ): Effect.Effect<
    void,
    HealthProfileRepositoryError | HealthProfileRepositoryNotFoundError,
    never
  >
}

export class HealthProfileRepositoryError extends Data.TaggedError(
  'HealthProfileRepositoryError'
)<{ readonly message: string; readonly cause?: unknown }> {}

export class HealthProfileRepositoryNotFoundError extends Data.TaggedError(
  'HealthProfileRepositoryNotFoundError'
)<{ readonly id: string; readonly cause?: unknown }> {}

export const HealthProfileRepository =
  Context.GenericTag<HealthProfileRepository>('HealthProfileRepository')
