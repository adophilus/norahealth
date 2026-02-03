import { Effect, Layer } from 'effect'
import { AgentConversationRepository } from '../repository'
import { LLMService } from '../service'
import {
  type CreateConversationPayload,
  CreateConversationUseCase,
  GetConversationUseCase,
  type SendMessagePayload,
  SendMessageUseCase
} from './index'

export const CreateConversationUseCaseLive = Layer.effect(
  CreateConversationUseCase,
  Effect.gen(function* () {
    const repository = yield* AgentConversationRepository
    const llm = yield* LLMService

    return CreateConversationUseCase.of({
      execute: (payload) =>
        Effect.gen(function* () {
          // Create initial conversation
          const conversation = yield* repository.create({
            user_id: payload.user_id,
            agent_type: payload.agent_type,
            messages: JSON.stringify([
              { role: 'user', content: payload.initial_message }
            ]),
            context: payload.context ? JSON.stringify(payload.context) : null
          })

          // Generate initial agent response
          const agentResponse = yield* llm.generateConversationResponse(
            payload.agent_type,
            [{ role: 'user', content: payload.initial_message }],
            payload.initial_message,
            payload.context
          )

          // Update conversation with agent response
          const updatedMessages = JSON.stringify([
            { role: 'user', content: payload.initial_message },
            { role: 'assistant', content: agentResponse }
          ])

          const updatedConversation = yield* repository.updateById(
            conversation.id,
            {
              messages: updatedMessages
            }
          )

          return updatedConversation
        })
    })
  })
)

export const SendMessageUseCaseLive = Layer.effect(
  SendMessageUseCase,
  Effect.gen(function* () {
    const repository = yield* AgentConversationRepository
    const llm = yield* LLMService

    return SendMessageUseCase.of({
      execute: (conversationId, payload) =>
        Effect.gen(function* () {
          // Get existing conversation
          const existingConversation =
            yield* repository.findById(conversationId)
          const conversation = existingConversation.pipe(
            Effect.mapError(() => new Error('Conversation not found'))
          )

          // Parse existing messages
          const messages = JSON.parse(conversation.messages) as Array<{
            role: string
            content: string
          }>

          // Add user message
          messages.push({ role: 'user', content: payload.message })

          // Generate agent response
          const agentResponse = yield* llm.generateConversationResponse(
            conversation.agent_type,
            messages,
            payload.message,
            payload.context
          )

          // Add agent response to messages
          messages.push({ role: 'assistant', content: agentResponse })

          // Update conversation
          const updatedConversation = yield* repository.updateById(
            conversationId,
            {
              messages: JSON.stringify(messages),
              context: payload.context
                ? JSON.stringify(payload.context)
                : conversation.context
            }
          )

          return updatedConversation
        })
    })
  })
)

export const GetConversationUseCaseLive = Layer.effect(
  GetConversationUseCase,
  Effect.gen(function* () {
    const repository = yield* AgentConversationRepository

    return GetConversationUseCase.of({
      execute: (conversationId) => repository.findById(conversationId)
    })
  })
)
