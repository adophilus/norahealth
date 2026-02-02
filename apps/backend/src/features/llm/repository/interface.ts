import { Context, type Effect, type Option } from 'effect'
import type { AgentConversation } from '@/types'
import type {
  AgentConversationRepositoryError,
  AgentConversationRepositoryNotFoundError
} from './error'

export class AgentConversationRepository extends Context.Tag(
  'AgentConversationRepository'
)<
  AgentConversationRepository,
  {
    create: (
      payload: Omit<AgentConversation.Insertable, 'id' | 'created_at'>
    ) => Effect.Effect<
      AgentConversation.Selectable,
      AgentConversationRepositoryError
    >

    findById: (
      id: string
    ) => Effect.Effect<
      Option.Option<AgentConversation.Selectable>,
      AgentConversationRepositoryError
    >

    findByUserId: (
      userId: string,
      agentType?: string
    ) => Effect.Effect<
      AgentConversation.Selectable[],
      AgentConversationRepositoryError
    >

    updateById: (
      id: string,
      payload: Partial<Omit<AgentConversation.Updateable, 'id' | 'created_at'>>
    ) => Effect.Effect<
      AgentConversation.Selectable,
      AgentConversationRepositoryError
    >

    deleteById: (
      id: string
    ) => Effect.Effect<
      void,
      | AgentConversationRepositoryError
      | AgentConversationRepositoryNotFoundError
    >
  }
>() {}
