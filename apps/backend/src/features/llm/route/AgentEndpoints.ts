import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import {
  ConversationResponse,
  GetConversationResponse,
  SendMessageResponse
} from '@nora-health/api/Agents/types'
import { Effect, Option } from 'effect'
import { AgentConversationRepository } from '../repository'
import { AgentConversationRepositoryNotFoundError } from '../repository/error'
import { LLMService } from '../service'
import type { ConversationMessage } from '../service/interface'

export const CreateConversationEndpointLive = HttpApiBuilder.handler(
  Api,
  'Agents',
  'createConversation',
  ({ payload }) =>
    Effect.gen(function* () {
      const repository = yield* AgentConversationRepository

      // Create initial conversation
      const conversation = yield* repository.create({
        user_id: payload.user_id,
        agent_type: payload.agent_type,
        messages: JSON.stringify([
          { role: 'user', content: payload.initial_message }
        ]),
        context: payload.context ? JSON.stringify(payload.context) : null
      })

      return ConversationResponse.make({
        id: conversation.id,
        user_id: conversation.user_id,
        agent_type: conversation.agent_type,
        messages: conversation.messages,
        context: conversation.context,
        created_at: conversation.created_at,
        updated_at: conversation.updated_at
      })
    })
)

export const GetConversationEndpointLive = HttpApiBuilder.handler(
  Api,
  'Agents',
  'getConversation',
  ({ path: { id } }) =>
    Effect.gen(function* () {
      const repository = yield* AgentConversationRepository

      const conversationOption = yield* repository.findById(id)

      return Option.match(conversationOption, {
        onNone: () =>
          Effect.fail(
            new AgentConversationRepositoryNotFoundError({
              message: 'Conversation not found'
            })
          ),
        onSome: (conv) =>
          Effect.succeed(
            GetConversationResponse.make({
              id: conv.id,
              user_id: conv.user_id,
              agent_type: conv.agent_type,
              messages: conv.messages,
              context: conv.context,
              created_at: conv.created_at,
              updated_at: conv.updated_at
            })
          )
      })
    })
)

export const SendMessageEndpointLive = HttpApiBuilder.handler(
  Api,
  'Agents',
  'sendMessage',
  ({ path: { id }, payload }) =>
    Effect.gen(function* () {
      const repository = yield* AgentConversationRepository
      const llm = yield* LLMService

      // Get existing conversation
      const conversationOption = yield* repository.findById(id)

      const conversation = yield* Option.match(conversationOption, {
        onNone: () =>
          Effect.fail(
            new AgentConversationRepositoryNotFoundError({
              message: 'Conversation not found'
            })
          ),
        onSome: (conv) => Effect.succeed(conv)
      })

      // Parse existing messages with proper type validation
      const parsedMessages = JSON.parse(conversation.messages) as Array<{
        role: string
        content: string
      }>
      const messages: ConversationMessage[] = parsedMessages.filter(
        (msg): msg is ConversationMessage =>
          ['user', 'assistant', 'system'].includes(msg.role)
      )

      // Add user message
      messages.push({ role: 'user', content: payload.message })

      // Generate agent response
      const agentResponse = yield* llm.generateConversationResponse(
        conversation.agent_type,
        messages,
        payload.message,
        payload.context ? JSON.parse(conversation.context || '{}') : undefined
      )

      // Add agent response to conversation
      messages.push({ role: 'assistant', content: agentResponse })

      // Update conversation
      const updatedConversation = yield* repository.updateById(id, {
        messages: JSON.stringify(messages),
        context: payload.context
          ? JSON.stringify(payload.context)
          : conversation.context
      })

      return SendMessageResponse.make({
        conversation_id: updatedConversation.id,
        agent_response: agentResponse,
        messages: updatedConversation.messages,
        updated_at: updatedConversation.updated_at || Date.now()
      })
    })
)
