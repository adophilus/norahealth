import { Data } from 'effect'

export class LLMServiceError extends Data.TaggedError('LLMServiceError')<{
  message: string
  cause?: unknown
}> {}

export class LLMServiceConfigurationError extends Data.TaggedError(
  'LLMServiceConfigurationError'
)<{
  message: string
  cause?: unknown
}> {}

export class LLMServiceGenerationError extends Data.TaggedError(
  'LLMServiceGenerationError'
)<{
  message: string
  cause?: unknown
}> {}

export class LLMServiceProviderError extends Data.TaggedError(
  'LLMServiceProviderError'
)<{
  message: string
  provider: string
  cause?: unknown
}> {}

export class LLMServiceTimeoutError extends Data.TaggedError(
  'LLMServiceTimeoutError'
)<{
  message: string
  cause?: unknown
}> {}

export type LLMServiceOperationError =
  | LLMServiceError
  | LLMServiceConfigurationError
  | LLMServiceGenerationError
  | LLMServiceProviderError
  | LLMServiceTimeoutError
