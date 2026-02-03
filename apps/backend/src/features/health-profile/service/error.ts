import { Data } from 'effect'

export class HealthProfileServiceError extends Data.TaggedError(
  'HealthProfileServiceError'
)<{ message: string; cause?: unknown }> {}

export class HealthProfileServiceNotFoundError extends Data.TaggedError(
  'HealthProfileServiceNotFoundError'
)<{ cause?: unknown }> {}
