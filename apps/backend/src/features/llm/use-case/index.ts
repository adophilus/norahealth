import type { AgentConversation } from '@nora-health/domain'
import { Context, Data, type Effect, type Option } from 'effect'
import type {
  AgentConversationRepositoryError,
  AgentConversationRepositoryNotFoundError
} from '../repository/error'
import type {
  LLMServiceError,
  LLMServiceGenerationError,
  LLMServiceTimeoutError
} from '../service/error'
import type { ConversationMessage } from '../service/interface'

export type CreateConversationPayload = {
  user_id: string
  agent_type: 'INTAKE_SAFETY' | 'MEAL_PLANNER' | 'EXERCISE_COACH' | 'LOGISTICS'
  initial_message: string
  context?: Record<string, unknown>
}

export type SendMessagePayload = {
  message: string
  context?: Record<string, unknown>
}

export class UseCaseError extends Data.TaggedError('UseCaseError')<{
  message: string
  cause?: unknown
}> {}

export class ConversationNotFoundError extends Data.TaggedError(
  'ConversationNotFoundError'
)<{
  message: string
}> {
  constructor() {
    super({ message: 'Conversation not found' })
  }
}

export class InvalidMessageError extends Data.TaggedError(
  'InvalidMessageError'
)<{
  message: string
}> {
  constructor() {
    super({ message: 'Invalid message format' })
  }
}

export class CreateConversationUseCase extends Context.Tag(
  'CreateConversationUseCase'
)<
  CreateConversationUseCase,
  {
    execute: (
      payload: CreateConversationPayload
    ) => Effect.Effect<
      AgentConversation,
      | AgentConversationRepositoryError
      | LLMServiceError
      | LLMServiceGenerationError
      | LLMServiceTimeoutError
      | UseCaseError
    >
  }
>() {}

export class GetConversationUseCase extends Context.Tag(
  'GetConversationUseCase'
)<
  GetConversationUseCase,
  {
    execute: (
      conversationId: string
    ) => Effect.Effect<
      Option.Option<AgentConversation>,
      | AgentConversationRepositoryNotFoundError
      | AgentConversationRepositoryError
    >
  }
>() {}

export class SendMessageUseCase extends Context.Tag('SendMessageUseCase')<
  SendMessageUseCase,
  {
    execute: (
      conversationId: string,
      payload: SendMessagePayload
    ) => Effect.Effect<
      AgentConversation,
      | AgentConversationRepositoryNotFoundError
      | AgentConversationRepositoryError
      | LLMServiceError
      | LLMServiceGenerationError
      | LLMServiceTimeoutError
      | UseCaseError
    >
  }
>() {}
