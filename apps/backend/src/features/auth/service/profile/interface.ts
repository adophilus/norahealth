import type { AuthProfile, AuthProfileMeta } from '@nora-health/domain'
import { Context, type Effect } from 'effect'
import type { AuthProfile as AuthProfileTypes } from '@/types'
import type {
  AuthProfileServiceAlreadyExistsError,
  AuthProfileServiceError,
  AuthProfileServiceNotFoundError
} from './error'

export class AuthProfileService extends Context.Tag('AuthProfileService')<
  AuthProfileService,
  {
    create: (
      payload: Omit<AuthProfileTypes.Insertable, 'meta'> & {
        meta: AuthProfileMeta
      }
    ) => Effect.Effect<
      AuthProfile,
      AuthProfileServiceAlreadyExistsError | AuthProfileServiceError
    >

    findById: (
      id: string
    ) => Effect.Effect<
      AuthProfile,
      AuthProfileServiceNotFoundError | AuthProfileServiceError
    >

    findByUserId: (
      user_id: string
    ) => Effect.Effect<AuthProfile[], AuthProfileServiceError>

    findByFarcasterFid: (
      fid: string
    ) => Effect.Effect<
      AuthProfile,
      AuthProfileServiceNotFoundError | AuthProfileServiceError
    >

    updateById: (
      id: string,
      payload: Omit<
        AuthProfileTypes.Updateable,
        'id' | 'created_at' | 'updated_at'
      >
    ) => Effect.Effect<
      AuthProfile,
      AuthProfileServiceNotFoundError | AuthProfileServiceError
    >

    deleteById: (
      id: string
    ) => Effect.Effect<
      AuthProfile,
      AuthProfileServiceError | AuthProfileServiceNotFoundError
    >
  }
>() {}
