import { generateObject as aiGenerateObject, generateText } from 'ai'
import { Config, Effect, Layer } from 'effect'
import { createZhipu } from 'zhipu-ai-provider'
import { AppConfig } from '@/features/config'
import {
  LLMServiceConfigurationError,
  LLMServiceGenerationError,
  LLMServiceProviderError,
  LLMServiceTimeoutError
} from './error'
import { LLMService } from './interface'

const createZhipuProvider = (apiKey: string) => {
  return createZhipu({
    baseURL: 'https://api.z.ai/api/coding/paas/v4',
    apiKey
  })
}

const AGENT_SYSTEM_PROMPTS: Record<string, string> = {
  INTAKE_SAFETY: `You are the Intake & Safety Agent for NoraHealth. Your role is to:
1. Welcome new users and guide them through onboarding
2. Collect comprehensive health information safely and responsibly
3. Validate user inputs for medical redlines and safety concerns
4. Provide clear warnings about any identified risks
5. Guide users to appropriate next steps or professional help when needed
6. Maintain a warm, supportive, and professional demeanor

Always prioritize user safety. If any information suggests immediate medical risk, clearly advise the user to seek professional medical attention.`,
  MEAL_PLANNER: `You are the Meal Planner Agent for NoraHealth. Your role is to:
1. Help users create personalized meal plans based on their goals, preferences, and dietary restrictions
2. Suggest recipes that align with their health profile
3. Consider their available ingredients from their pantry
4. Ensure nutritional balance and variety
5. Adapt suggestions based on seasonal ingredients and user feedback
6. Provide clear, easy-to-follow cooking instructions

Always respect dietary restrictions and allergies. When suggesting alternatives, explain why they're suitable substitutes.`,
  EXERCISE_COACH: `You are the Exercise Coach Agent for NoraHealth. Your role is to:
1. Create personalized workout plans based on user fitness level and goals
2. Adapt exercises for physical constraints or limitations
3. Consider weather conditions for outdoor activities
4. Provide proper form cues and safety warnings
5. Progressively challenge users while maintaining safety
6. Track and celebrate progress

Always prioritize safety over intensity. If users report pain or unusual symptoms, advise them to stop and consult a healthcare professional.`,
  LOGISTICS: `You are the Logistics Agent for NoraHealth. Your role is to:
1. Help users find stores that sell ingredients they need
2. Provide location-based suggestions using their address or current location
3. Consider store hours, availability, and user preferences
4. Offer alternatives when items are out of stock
5. Optimize routes for multiple store visits
6. Provide practical shopping tips

Always provide accurate and helpful location information. If uncertain about availability, suggest calling ahead.`
}

export const LLMServiceLive = Layer.effect(
  LLMService,
  Effect.gen(function* () {
    const config = yield* AppConfig

    const apiKey = yield* Effect.tryPromise({
      try: () => Config.string('ZHIPU_API_KEY'),
      catch: (error) =>
        new LLMServiceConfigurationError({
          message: 'ZHIPU_API_KEY not found in environment',
          cause: error
        })
    })

    const zhipu = createZhipuProvider(apiKey)
    const defaultModel = config.llm.glm.model

    const generateWithRetry = async <T>(
      generateFn: () => Promise<T>,
      maxRetries = 3
    ): Promise<T> => {
      let lastError: unknown
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          return await generateFn()
        } catch (error) {
          lastError = error
          if (attempt < maxRetries - 1) {
            await new Promise((resolve) =>
              setTimeout(resolve, 2 ** attempt * 1000)
            )
          }
        }
      }
      throw lastError
    }

    return LLMService.of({
      generateText: (prompt, options) =>
        Effect.tryPromise({
          try: () =>
            generateWithRetry(() =>
              generateText({
                model: zhipu(options?.model || defaultModel),
                prompt,
                temperature: options?.temperature ?? 0.7,
                maxTokens: options?.maxTokens ?? 1000,
                system: options?.systemPrompt
              })
            ).then((result) => result.text)
        }).pipe(
          Effect.catchAll((error) =>
            Effect.fail(
              new LLMServiceGenerationError({
                message: `Failed to generate text: ${String(error)}`,
                cause: error
              })
            )
          )
        ),

      generateObject: (prompt, options) =>
        Effect.tryPromise({
          try: () =>
            generateWithRetry(() =>
              aiGenerateObject({
                model: zhipu(options?.model || defaultModel),
                prompt,
                schema: options.schema,
                temperature: options?.temperature ?? 0.3,
                maxTokens: options?.maxTokens ?? 1000,
                system: options?.systemPrompt
              })
            ).then((result) => result.object as typeof options.schema)
        }).pipe(
          Effect.catchAll((error) =>
            Effect.fail(
              new LLMServiceGenerationError({
                message: `Failed to generate object: ${String(error)}`,
                cause: error
              })
            )
          )
        ),

      generateConversationResponse: (
        agentType,
        conversationHistory,
        userMessage,
        context
      ) =>
        Effect.tryPromise({
          try: () => {
            const systemPrompt =
              AGENT_SYSTEM_PROMPTS[agentType] ||
              'You are a helpful assistant for NoraHealth.'

            const contextInfo = context
              ? `\n\nAdditional context: ${JSON.stringify(context, null, 2)}`
              : ''

            const conversationHistoryText = conversationHistory
              .map((msg) => `${msg.role}: ${msg.content}`)
              .join('\n')

            return generateWithRetry(() =>
              generateText({
                model: zhipu(defaultModel),
                prompt: `${conversationHistoryText}\n\nuser: ${userMessage}${contextInfo}`,
                system: systemPrompt,
                temperature: 0.7,
                maxTokens: 1000
              })
            ).then((result) => result.text)
          }
        }).pipe(
          Effect.catchAll((error) =>
            Effect.fail(
              new LLMServiceGenerationError({
                message: `Failed to generate conversation response: ${String(error)}`,
                cause: error
              })
            )
          )
        ),

      categorizeIngredients: (ingredients) =>
        Effect.tryPromise({
          try: () =>
            generateWithRetry(() =>
              aiGenerateObject({
                model: zhipu(defaultModel),
                prompt: `Categorize the following ingredients by their dietary restrictions. 
Consider: PEANUTS, DAIRY, GLUTEN, SOY, EGGS, SHELLFISH, TREE_NUTS, FISH.
If an ingredient doesn't fall under any category, categorize it as "NONE".

Ingredients: ${ingredients.join(', ')}

Return a JSON object where keys are ingredient names (preserving the exact input) and values are arrays of dietary restriction categories they belong to.`,
                schema: {
                  type: 'object',
                  properties: ingredients.reduce(
                    (acc, ingredient) => ({
                      ...acc,
                      [ingredient]: { type: 'array', items: { type: 'string' } }
                    }),
                    {}
                  )
                },
                temperature: 0.1,
                maxTokens: 500
              })
            ).then((result) => result.object as Record<string, string[]>)
        }).pipe(
          Effect.catchAll((error) =>
            Effect.fail(
              new LLMServiceGenerationError({
                message: `Failed to categorize ingredients: ${String(error)}`,
                cause: error
              })
            )
          )
        ),

      validateIngredientsAgainstRestrictions: (ingredients, restrictions) =>
        Effect.tryPromise({
          try: () =>
            generateWithRetry(() =>
              aiGenerateObject({
                model: zhipu(defaultModel),
                prompt: `Validate the following ingredients against these dietary restrictions: ${restrictions.join(', ')}.

Ingredients to validate: ${ingredients.join(', ')}

For each ingredient, determine if it violates any of the restrictions. Consider common allergens, ingredients derived from restricted categories, and common substitutes.

Return a JSON object with:
- "valid": array of ingredient names that are safe
- "invalid": array of objects with "ingredient" (string) and "restrictions" (array of string) for ingredients that violate restrictions`,
                schema: {
                  type: 'object',
                  properties: {
                    valid: {
                      type: 'array',
                      items: { type: 'string' }
                    },
                    invalid: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          ingredient: { type: 'string' },
                          restrictions: {
                            type: 'array',
                            items: { type: 'string' }
                          }
                        }
                      }
                    }
                  },
                  required: ['valid', 'invalid']
                },
                temperature: 0.1,
                maxTokens: 500
              })
            ).then(
              (result) =>
                result.object as {
                  valid: string[]
                  invalid: Array<{ ingredient: string; restrictions: string[] }>
                }
            )
        }).pipe(
          Effect.catchAll((error) =>
            Effect.fail(
              new LLMServiceGenerationError({
                message: `Failed to validate ingredients: ${String(error)}`,
                cause: error
              })
            )
          )
        )
    })
  })
)
