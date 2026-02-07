import { Effect, Layer, Console, Option } from 'effect'
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
            Effect.tap(Console.log),
            Effect.map(d => User.make(d)),
            Effect.tap(Console.log),
            Effect.catchTags({
              UserRepositoryEmailAlreadyInUseError: (error) =>
                new UserServiceEmailAlreadyInUseError({
                  message: error.message,
                  cause: error
                }),
              UserRepositoryError: (error) =>
                new UserServiceError({ message: error.message, cause: error })
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
              new UserServiceError({ message: error.message, cause: error })
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
              new UserServiceError({ message: error.message, cause: error })
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
              new UserServiceError({ message: error.message, cause: error })
          })
        )
    })
  })
)
