import { Data } from 'effect'

export class AgentConversationRepositoryError extends Data.TaggedError(
  'AgentConversationRepositoryError'
)<{
  message: string
  cause?: unknown
}> {}

export class AgentConversationRepositoryNotFoundError extends Data.TaggedError(
  'AgentConversationRepositoryNotFoundError'
)<{
  message: string
  cause?: unknown
}> {}
