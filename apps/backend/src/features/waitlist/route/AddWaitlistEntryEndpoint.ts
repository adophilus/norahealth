import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { AddWaitlistEntrySuccessResponse } from '@nora-health/api/Waitlist/AddWaitlistEntryEndpoint'
import { UnexpectedError } from '@nora-health/api/common'
import { Effect } from 'effect'
import { WaitlistService } from '../service'
import { Mailer } from '@/features/mailer'
import { WaitlistNotificationMail } from '@/emails'

export const AddWaitlistEntryEndpointLive = HttpApiBuilder.handler(
  Api,
  'Waitlist',
  'addWaitlistEntry',
  ({ payload }) =>
    Effect.gen(function* () {
      const waitlistService = yield* WaitlistService
      const mailer = yield* Mailer

      const email = yield* WaitlistNotificationMail()

      yield* mailer.send({
        recipients: [payload.email],
        subject: 'You are on the waitlist!',
        email
      })

      yield* waitlistService.addEntry(payload.email)

      return AddWaitlistEntrySuccessResponse.make({})
    }).pipe(
      Effect.mapError((error) => {
        if (
          error._tag === 'MailerValidationError' ||
          error._tag === 'MailerRenderingError' ||
          error._tag === 'MailerTransportError'
        )
          return new UnexpectedError({
            message: `Failed to add send mail: ${error.message}`
          })
        return error
      }),
      Effect.catchTags({
        WaitlistServiceError: (error) =>
          Effect.fail(
            new UnexpectedError({
              message: `Failed to add entry to waitlist: ${error.message}`
            })
          ),
        WaitlistServiceEntryAlreadyExistsError: () =>
          Effect.succeed(new AddWaitlistEntrySuccessResponse())
      })
    )
)
