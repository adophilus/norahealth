import type { AgentType } from '@nora-health/domain'
import { Context, type Effect } from 'effect'
import type {
  LLMServiceError,
  LLMServiceGenerationError,
  LLMServiceTimeoutError
} from './error'

export type ConversationMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export type GenerateTextOptions = {
  model?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
}

export type GenerateObjectOptions<T> = {
  model?: string
  temperature?: number
  maxTokens?: number
  schema: Record<string, unknown>
  systemPrompt?: string
}

export class LLMService extends Context.Tag('LLMService')<
  LLMService,
  {
    generateText: (
      prompt: string,
      options?: GenerateTextOptions
    ) => Effect.Effect<
      string,
      LLMServiceGenerationError | LLMServiceTimeoutError | LLMServiceError
    >

    generateObject: <T = unknown>(
      prompt: string,
      options: GenerateObjectOptions<T>
    ) => Effect.Effect<
      T,
      LLMServiceGenerationError | LLMServiceTimeoutError | LLMServiceError
    >

    generateConversationResponse: (
      agentType: AgentType,
      conversationHistory: ConversationMessage[],
      userMessage: string,
      context?: Record<string, unknown>
    ) => Effect.Effect<
      string,
      LLMServiceGenerationError | LLMServiceTimeoutError | LLMServiceError
    >

    categorizeIngredients: (
      ingredients: string[]
    ) => Effect.Effect<
      Record<string, string[]>,
      LLMServiceGenerationError | LLMServiceTimeoutError | LLMServiceError
    >

    validateIngredientsAgainstRestrictions: (
      ingredients: string[],
      restrictions: string[]
    ) => Effect.Effect<
      {
        valid: string[]
        invalid: Array<{ ingredient: string; restrictions: string[] }>
      },
      LLMServiceGenerationError | LLMServiceTimeoutError | LLMServiceError
    >
  }
>() {}
