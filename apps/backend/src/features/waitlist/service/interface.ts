import { Context, type Effect } from 'effect'
import type { WaitlistEntry } from '@nora-health/domain'
import type {
  WaitlistServiceEntryAlreadyExistsError,
  WaitlistServiceError
} from './error'

export class WaitlistService extends Context.Tag('WaitlistService')<
  WaitlistService,
  {
    addEntry(
      email: string
    ): Effect.Effect<
      WaitlistEntry,
      WaitlistServiceEntryAlreadyExistsError | WaitlistServiceError
    >
  }
>() {}
