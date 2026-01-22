import { Effect, Layer, Schema } from 'effect'
import { WaitlistService } from './interface'
import { WaitlistRepository } from '../repository/interface'
import {
  WaitlistServiceError,
  WaitlistServiceEntryAlreadyExistsError
} from './error'
import { Email } from '@nora-health/domain'
import { ulid } from 'ulidx'

export const WaitlistServiceLive = Layer.effect(
  WaitlistService,
  Effect.gen(function* () {
    const waitlistRepository = yield* WaitlistRepository

    return WaitlistService.of({
      addEntry: (email) =>
        Effect.gen(function* () {
          const emailAddress = yield* Schema.decode(Email)(email)

          const existingEntry =
            yield* waitlistRepository.findByEmail(emailAddress)

          if (existingEntry) {
            return yield* Effect.fail(
              new WaitlistServiceEntryAlreadyExistsError({
                email,
                message: `Waitlist entry for ${emailAddress} already exists.`
              })
            )
          }

          return yield* waitlistRepository.create({
            id: ulid(),
            email: emailAddress
          })
        }).pipe(
          Effect.catchTags({
            ParseError: () =>
              Effect.fail(
                new WaitlistServiceError({ message: 'Invalid email address' })
              ),
            WaitlistRepositoryError: (error) =>
              Effect.fail(
                new WaitlistServiceError({
                  message: `Failed to add entry to waitlist: ${error.message}`,
                  cause: error
                })
              )
          })
        )
    })
  })
)
