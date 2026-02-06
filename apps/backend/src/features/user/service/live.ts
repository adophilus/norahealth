import { Effect, Layer, Option } from 'effect'
import { UserService } from './interface'
import {
  UserServiceEmailAlreadyInUseError,
  UserServiceError,
  UserServiceNotFoundError
} from './error'
import { UserRepository } from '../repository'
import { ulid } from 'ulidx'
import { User } from '@nora-health/domain'

export const UserServiceLive = Layer.effect(
  UserService,
  Effect.gen(function* () {
    const userRepository = yield* UserRepository

    return UserService.of({
      create: (payload) =>
        userRepository
          .create({
            id: ulid(),
            ...payload
          })
          .pipe(
            Effect.map(User.make),
            Effect.catchTags({
              UserRepositoryEmailAlreadyInUseError: (error) =>
                new UserServiceEmailAlreadyInUseError({
                  message: error.message
                }),
              UserRepositoryError: (error) =>
                new UserServiceError({ message: error.message })
            })
          ),

      findById: (id) =>
        userRepository.findById(id).pipe(
          Effect.flatMap(
            Option.match({
              onSome: (userSelectable) =>
                Effect.succeed(User.make(userSelectable)),
              onNone: () => Effect.fail(new UserServiceNotFoundError({}))
            })
          ),
          Effect.catchTags({
            UserRepositoryError: (error) =>
              new UserServiceError({ message: error.message })
          })
        ),

      findByEmail: (email) =>
        userRepository.findByEmail(email).pipe(
          Effect.flatMap(
            Option.match({
              onSome: (userSelectable) =>
                Effect.succeed(User.make(userSelectable)),
              onNone: () => Effect.fail(new UserServiceNotFoundError({}))
            })
          ),
          Effect.catchTags({
            UserRepositoryError: (error) =>
              new UserServiceError({ message: error.message })
          })
        ),

      updateById: (id, payload) =>
        userRepository.updateById(id, payload).pipe(
          Effect.map(User.make),
          Effect.catchTags({
            UserRepositoryError: (error) =>
              new UserServiceError({ message: error.message })
          })
        ),

      deleteById: (id) =>
        userRepository.deleteById(id).pipe(
          Effect.catchTags({
            UserRepositoryNotFoundError: (error) =>
              new UserServiceNotFoundError({ cause: error }),
            UserRepositoryError: (error) =>
              new UserServiceError({ message: error.message })
          })
        )
    })
  })
)
