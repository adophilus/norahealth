import type { HealthProfile } from '@/types'
import { Context, type Option, type Effect } from 'effect'
import type { HealthProfileRepositoryError } from './error'

export class HealthProfileRepository extends Context.Tag(
  'HealthProfileRepository'
)<
  HealthProfileRepository,
  {
    create(
      payload: HealthProfile.Insertable
    ): Effect.Effect<
      HealthProfile.Selectable,
      HealthProfileRepositoryError,
      never
    >
    findById(
      id: string
    ): Effect.Effect<
      Option.Option<HealthProfile.Selectable>,
      HealthProfileRepositoryError
    >
    findByUserId(
      userId: string
    ): Effect.Effect<
      Option.Option<HealthProfile.Selectable>,
      HealthProfileRepositoryError
    >
    update(
      id: string,
      payload: HealthProfile.Updateable
    ): Effect.Effect<
      Option.Option<HealthProfile.Selectable>,
      HealthProfileRepositoryError
    >
    delete(
      id: string
    ): Effect.Effect<
      Option.Option<HealthProfile.Selectable>,
      HealthProfileRepositoryError
    >
  }
>() {}
