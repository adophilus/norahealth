import { Context, type Effect } from 'effect'
import type { User as TUser } from '@/types'
import type {
  UserServiceEmailAlreadyInUseError,
  UserServiceError,
  UserServiceNotFoundError
} from './error'
import type { User } from '@nora-health/domain'

export class UserService extends Context.Tag('UserService')<
  UserService,
  {
    create: (
      payload: TUser.Insertable
    ) => Effect.Effect<
      User,
      UserServiceEmailAlreadyInUseError | UserServiceError
    >

    findById: (
      id: string
    ) => Effect.Effect<User, UserServiceNotFoundError | UserServiceError>

    findByEmail: (
      email: string
    ) => Effect.Effect<User, UserServiceNotFoundError | UserServiceError>

    verifyById: (
      id: string
    ) => Effect.Effect<User, UserServiceNotFoundError | UserServiceError>

    updateById: (
      id: string,
      payload: Omit<
        TUser.Updateable,
        'id' | 'created_at' | 'updated_at' | 'email'
      >
    ) => Effect.Effect<User, UserServiceNotFoundError | UserServiceError>

    deleteById: (
      id: string
    ) => Effect.Effect<void, UserServiceNotFoundError | UserServiceError>
  }
>() {}
