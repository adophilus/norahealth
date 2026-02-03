import { Effect, Layer } from 'effect'
import { AgentConversationRepository } from '../repository'
import { AgentConversationRepositoryNotFoundError } from '../repository/error'
import { LLMService } from '../service'
import type { ConversationMessage } from '../service/interface'
import {
  type CreateConversationPayload,
  CreateConversationUseCase,
  GetConversationUseCase,
  type SendMessagePayload,
  SendMessageUseCase,
  UseCaseError
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
            messages: [
              { role: 'user' as const, content: payload.initial_message }
            ],
            context: payload.context ? JSON.stringify(payload.context) : null
          })

          // Generate initial agent response
          const agentResponse = yield* llm.generateConversationResponse(
            payload.agent_type,
            [...conversation.messages] as ConversationMessage[],
            payload.initial_message,
            payload.context
          )

          // Update conversation with agent response
          const updatedMessages: ConversationMessage[] = [
            { role: 'user' as const, content: payload.initial_message },
            { role: 'assistant' as const, content: agentResponse }
          ]

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
          const conversationOption = yield* repository.findById(conversationId)
          const conversation = yield* conversationOption.pipe(
            Effect.orElseFail(
              () =>
                new AgentConversationRepositoryNotFoundError({
                  message: 'Conversation not found'
                })
            )
          )

          // Add user message to existing messages
          const updatedMessages: ConversationMessage[] = [
            ...conversation.messages,
            { role: 'user' as const, content: payload.message }
          ]

          // Generate agent response
          const agentResponse = yield* llm.generateConversationResponse(
            conversation.agent_type,
            updatedMessages,
            payload.message,
            payload.context
          )

          // Add agent response to messages
          const finalMessages: ConversationMessage[] = [
            ...updatedMessages,
            { role: 'assistant' as const, content: agentResponse }
          ]

          // Update conversation
          const updatedContext = payload.context
            ? JSON.stringify(payload.context)
            : conversation.context

          const updatedConversation = yield* repository.updateById(
            conversationId,
            {
              messages: finalMessages,
              context: updatedContext
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
