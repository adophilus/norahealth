import { Data } from 'effect'

export class WaitlistServiceError extends Data.TaggedError(
  'WaitlistServiceError'
)<{
  message: string
  cause?: unknown
}> {}

export class WaitlistServiceEntryAlreadyExistsError extends Data.TaggedError(
  'WaitlistServiceEntryAlreadyExistsError'
)<{
  email: string
  message: string
  cause?: unknown
}> {}

export type WaitlistServiceOperationError =
  | WaitlistServiceError
  | WaitlistServiceEntryAlreadyExistsError
