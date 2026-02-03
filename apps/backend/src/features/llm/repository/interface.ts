import type { AgentConversation } from '@nora-health/domain'
import { Context, type Effect, type Option } from 'effect'
import type {
  AgentConversationRepositoryError,
  AgentConversationRepositoryNotFoundError
} from './error'

export interface AgentConversationPayload {
  user_id: string
  agent_type: 'INTAKE_SAFETY' | 'MEAL_PLANNER' | 'EXERCISE_COACH' | 'LOGISTICS'
  messages: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp?: number | null
  }>
  context?: string | null
}

export interface AgentConversationUpdatePayload {
  messages?: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp?: number | null
  }>
  context?: string | null
}

export class AgentConversationRepository extends Context.Tag(
  'AgentConversationRepository'
)<
  AgentConversationRepository,
  {
    create: (
      payload: AgentConversationPayload
    ) => Effect.Effect<AgentConversation, AgentConversationRepositoryError>

    findById: (
      id: string
    ) => Effect.Effect<
      Option.Option<AgentConversation>,
      AgentConversationRepositoryError
    >

    findByUserId: (
      userId: string,
      agentType?: string
    ) => Effect.Effect<AgentConversation[], AgentConversationRepositoryError>

    updateById: (
      id: string,
      payload: AgentConversationUpdatePayload
    ) => Effect.Effect<AgentConversation, AgentConversationRepositoryError>

    deleteById: (
      id: string
    ) => Effect.Effect<
      void,
      | AgentConversationRepositoryError
      | AgentConversationRepositoryNotFoundError
    >
  }
>() {}
