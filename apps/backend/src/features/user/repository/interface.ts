import { Context, type Option, type Effect } from 'effect'
import type { User } from '@/types'
import type {
  UserRepositoryEmailAlreadyInUseError,
  UserRepositoryError,
  UserRepositoryNotFoundError
} from './error'

export class UserRepository extends Context.Tag('UserRepository')<
  UserRepository,
  {
    create: (
      payload: User.Insertable
    ) => Effect.Effect<
      User.Selectable,
      UserRepositoryEmailAlreadyInUseError | UserRepositoryError
    >

    findById: (
      id: string
    ) => Effect.Effect<Option.Option<User.Selectable>, UserRepositoryError>

    findByEmail: (
      email: string
    ) => Effect.Effect<Option.Option<User.Selectable>, UserRepositoryError>

    updateById: (
      id: string,
      payload: Omit<
        User.Updateable,
        'id' | 'created_at' | 'updated_at' | 'email'
      >
    ) => Effect.Effect<User.Selectable, UserRepositoryError>

    deleteById: (
      id: string
    ) => Effect.Effect<void, UserRepositoryError | UserRepositoryNotFoundError>
  }
>() {}
