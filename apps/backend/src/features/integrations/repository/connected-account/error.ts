import { Data } from 'effect'

export class ConnectedAccountRepositoryError extends Data.TaggedError(
  'ConnectedAccountRepositoryError'
)<{
  message: string
  cause?: unknown
}> {}

export class ConnectedAccountNotFoundError extends Data.TaggedError(
  'ConnectedAccountNotFoundError'
)<{
  message: string
}> {}

export class AlreadyConnectedError extends Data.TaggedError(
  'AlreadyConnectedError'
)<{
  message: string
  account_id: string
}> {}
