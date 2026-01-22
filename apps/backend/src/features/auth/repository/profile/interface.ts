import { Context, type Effect, type Option } from 'effect'
import type { AuthProfile } from '@/types'
import type { AuthProfileRepositoryError } from './error'

export class AuthProfileRepository extends Context.Tag('AuthProfileRepository')<
  AuthProfileRepository,
  {
    create: (
      payload: AuthProfile.Insertable
    ) => Effect.Effect<AuthProfile.Selectable, AuthProfileRepositoryError>

    findById: (
      id: string
    ) => Effect.Effect<
      Option.Option<AuthProfile.Selectable>,
      AuthProfileRepositoryError
    >

    findByUserId: (
      user_id: string
    ) => Effect.Effect<AuthProfile.Selectable[], AuthProfileRepositoryError>

    findByEmail: (
      email: string
    ) => Effect.Effect<
      Option.Option<AuthProfile.Selectable>,
      AuthProfileRepositoryError
    >

    findByFarcasterFid: (
      fid: string
    ) => Effect.Effect<
      Option.Option<AuthProfile.Selectable>,
      AuthProfileRepositoryError
    >

    updateById: (
      id: string,
      payload: Omit<AuthProfile.Updateable, 'id' | 'created_at' | 'updated_at'>
    ) => Effect.Effect<
      Option.Option<AuthProfile.Selectable>,
      AuthProfileRepositoryError
    >

    deleteById: (
      id: string
    ) => Effect.Effect<
      Option.Option<AuthProfile.Selectable>,
      AuthProfileRepositoryError
    >
  }
>() { }
