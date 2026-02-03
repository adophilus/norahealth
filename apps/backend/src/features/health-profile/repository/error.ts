import { Data } from 'effect'

export class HealthProfileRepositoryError extends Data.TaggedError(
  'HealthProfileRepositoryError'
)<{ message: string; cause?: unknown }> {}
