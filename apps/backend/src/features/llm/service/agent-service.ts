import type { AgentConversation } from '@nora-health/domain'
import { Effect, Layer } from 'effect'
import { LLMService } from '../service/interface'

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

export interface AgentService {
  processMessage: (
    conversation: AgentConversation,
    userMessage: string,
    context?: Record<string, unknown>
  ) => Effect.Effect<string, Error, LLMService>
}

export class IntakeSafetyAgentService implements AgentService {
  processMessage(
    conversation: AgentConversation,
    userMessage: string,
    context?: Record<string, unknown>
  ): Effect.Effect<string, Error, LLMService> {
    return Effect.gen(function* () {
      const llmService = yield* LLMService

      // Extract health information from user message
      const extractedInfo = yield* llmService
        .generateObject(
          `Extract health information from this user message: "${userMessage}". 
        Return a JSON object with these fields if present:
        - dietaryExclusions: array of dietary restrictions (e.g., ["PEANUTS", "DAIRY"])
        - physicalConstraints: array of physical limitations (e.g., ["KNEE_PROBLEMS", "BACK_PAIN"])
        - medicalRedlines: array of medical red flags (e.g., ["DIABETES", "HEART_CONDITION"])
        - fitnessGoals: array of fitness goals (e.g., ["WEIGHT_LOSS", "MUSCLE_GAIN"])
        - fitnessLevel: one of "BEGINNER", "INTERMEDIATE", "ADVANCED"
        - resolutionClass: one of "PERFORMANCE", "VITALITY", "LONGEVITY"
        - immediateRisk: boolean if any immediate medical risks are detected
        - riskFactors: array of specific risk factors identified
        
        Only include fields that are clearly mentioned or can be reasonably inferred.`,
          {
            schema: {
              type: 'object',
              properties: {
                dietaryExclusions: {
                  type: 'array',
                  items: { type: 'string' }
                },
                physicalConstraints: {
                  type: 'array',
                  items: { type: 'string' }
                },
                medicalRedlines: {
                  type: 'array',
                  items: { type: 'string' }
                },
                fitnessGoals: { type: 'array', items: { type: 'string' } },
                fitnessLevel: {
                  type: 'string',
                  enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']
                },
                resolutionClass: {
                  type: 'string',
                  enum: ['PERFORMANCE', 'VITALITY', 'LONGEVITY']
                },
                immediateRisk: { type: 'boolean' },
                riskFactors: { type: 'array', items: { type: 'string' } }
              },
              additionalProperties: false
            }
          }
        )
        .pipe(Effect.catchAll(() => Effect.succeed({}))) as any

      // Generate appropriate response based on extracted information
      const responsePrompt = `You are the Intake & Safety Agent for NoraHealth. Based on the extracted health information:

${JSON.stringify(extractedInfo, null, 2)}

User's original message: "${userMessage}"

Generate a helpful, supportive response that:
1. Acknowledges the information provided
2. Highlights any important safety considerations
3. Asks clarifying questions if information is missing
4. Provides clear guidance on next steps
5. Shows empathy and maintains a professional, caring tone

${extractedInfo.immediateRisk ? 'IMPORTANT: This user has indicated potential medical risks. Include a strong recommendation to consult with healthcare professionals.' : ''}

Keep the response conversational and natural, not like a data output.`

      return yield* llmService.generateText(responsePrompt, {
        systemPrompt: AGENT_SYSTEM_PROMPTS.INTAKE_SAFETY,
        temperature: 0.7
      })
    })
  }
}

export class MealPlannerAgentService implements AgentService {
  processMessage(
    conversation: AgentConversation,
    userMessage: string,
    context?: Record<string, unknown>
  ): Effect.Effect<string, unknown, unknown> {
    return Effect.gen(function* () {
      const llmService = yield* LLMService

      // Extract meal planning information from user message
      const mealInfo = yield* Effect.tryPromise({
        try: () =>
          llmService
            .generateObject(
              `Extract meal planning information from this user message: "${userMessage}".
          Return a JSON object with these fields if present:
          - desiredMeal: string describing the meal they want
          - dietaryRestrictions: array of dietary restrictions
          - availableIngredients: array of ingredients they have
          - preferences: array of food preferences or dislikes
          - mealType: one of "BREAKFAST", "LUNCH", "DINNER", "SNACK", "ANY"
          - timeConstraint: number of minutes available for cooking
          - nutritionGoals: array of nutrition goals (e.g., ["HIGH_PROTEIN", "LOW_CARB"])
          - servingSize: number of servings needed
          
          Only include fields that are clearly mentioned or can be reasonably inferred.`,
              {
                schema: {
                  type: 'object',
                  properties: {
                    desiredMeal: { type: 'string' },
                    dietaryRestrictions: {
                      type: 'array',
                      items: { type: 'string' }
                    },
                    availableIngredients: {
                      type: 'array',
                      items: { type: 'string' }
                    },
                    preferences: { type: 'array', items: { type: 'string' } },
                    mealType: {
                      type: 'string',
                      enum: ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'ANY']
                    },
                    timeConstraint: { type: 'number' },
                    nutritionGoals: {
                      type: 'array',
                      items: { type: 'string' }
                    },
                    servingSize: { type: 'number' }
                  },
                  additionalProperties: false
                }
              }
            )
            .then((result: any) => result),
        catch: () => Effect.succeed({}) as any
      })

      // Validate ingredients if dietary restrictions are provided
      if (
        mealInfo.dietaryRestrictions &&
        mealInfo.dietaryRestrictions.length > 0
      ) {
        const ingredients =
          mealInfo.availableIngredients ||
          [mealInfo.desiredMeal].filter(Boolean)
        if (ingredients.length > 0) {
          const validation = yield* Effect.tryPromise({
            try: () =>
              llmService.validateIngredientsAgainstRestrictions(
                ingredients,
                mealInfo.dietaryRestrictions
              ),
            catch: () =>
              Effect.succeed({ valid: ingredients, invalid: [] }) as any
          })

          // Include validation results in response context
          mealInfo.validationResults = validation
        }
      }

      // Generate meal planning response
      const responsePrompt = `You are the Meal Planner Agent for NoraHealth. Based on this meal planning information:

${JSON.stringify(mealInfo, null, 2)}

User's original message: "${userMessage}"

${mealInfo.validationResults?.invalid?.length ? "IMPORTANT: Some ingredients may not be suitable for the user's dietary restrictions. Consider suggesting alternatives." : ''}

Generate a helpful, practical response that:
1. Suggests specific meal ideas or recipes
2. Considers their dietary restrictions and preferences
3. Uses available ingredients when possible
4. Provides clear, actionable cooking guidance
5. Suggests alternatives if there are dietary concerns
6. Includes nutritional considerations when relevant

If suggesting a recipe, include:
- Recipe name
- Key ingredients
- Brief preparation steps
- Cooking time estimate
- Serving size information

Keep the response conversational and practical.`

      return yield* Effect.tryPromise({
        try: () =>
          llmService.generateText(responsePrompt, {
            systemPrompt: AGENT_SYSTEM_PROMPTS.MEAL_PLANNER,
            temperature: 0.7
          }),
        catch: (error) => new Error(`Failed to generate response: ${error}`)
      })
    })
  }
}

export class ExerciseCoachAgentService implements AgentService {
  processMessage(
    conversation: AgentConversation,
    userMessage: string,
    context?: Record<string, unknown>
  ): Effect.Effect<string, unknown, unknown> {
    return Effect.gen(function* () {
      const llmService = yield* LLMService

      // Extract exercise information from user message
      const exerciseInfo = yield* Effect.tryPromise({
        try: () =>
          llmService
            .generateObject(
              `Extract exercise information from this user message: "${userMessage}".
          Return a JSON object with these fields if present:
          - workoutType: one of "CARDIO", "STRENGTH", "FLEXIBILITY", "HIIT", "COMPOUND"
          - fitnessLevel: one of "BEGINNER", "INTERMEDIATE", "ADVANCED"
          - duration: number of minutes for workout
          - location: one of "INDOOR", "OUTDOOR", "ANY"
          - equipment: array of available equipment (e.g., ["DUMBBELLS", "RESISTANCE_BANDS"])
          - goals: array of fitness goals
          - physicalConstraints: array of physical limitations
          - preferences: array of exercise preferences or dislikes
          - weatherCondition: string describing current weather (if outdoor exercise mentioned)
          
          Only include fields that are clearly mentioned or can be reasonably inferred.`,
              {
                schema: {
                  type: 'object',
                  properties: {
                    workoutType: {
                      type: 'string',
                      enum: [
                        'CARDIO',
                        'STRENGTH',
                        'FLEXIBILITY',
                        'HIIT',
                        'COMPOUND'
                      ]
                    },
                    fitnessLevel: {
                      type: 'string',
                      enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']
                    },
                    duration: { type: 'number' },
                    location: {
                      type: 'string',
                      enum: ['INDOOR', 'OUTDOOR', 'ANY']
                    },
                    equipment: { type: 'array', items: { type: 'string' } },
                    goals: { type: 'array', items: { type: 'string' } },
                    physicalConstraints: {
                      type: 'array',
                      items: { type: 'string' }
                    },
                    preferences: { type: 'array', items: { type: 'string' } },
                    weatherCondition: { type: 'string' }
                  },
                  additionalProperties: false
                }
              }
            )
            .then((result: any) => result),
        catch: () => Effect.succeed({}) as any
      })

      // Generate exercise response
      const responsePrompt = `You are the Exercise Coach Agent for NoraHealth. Based on this exercise information:

${JSON.stringify(exerciseInfo, null, 2)}

User's original message: "${userMessage}"

${exerciseInfo.weatherCondition ? `Weather context: ${exerciseInfo.weatherCondition}` : ''}
${exerciseInfo.physicalConstraints?.length ? 'IMPORTANT: User has physical limitations. Ensure all exercises are safe and appropriate.' : ''}

Generate a helpful, safe response that:
1. Suggests specific exercises or workout routines
2. Considers their fitness level and physical limitations
3. Provides clear form cues and safety instructions
4. Includes warm-up and cool-down recommendations
5. Adapts suggestions based on weather if outdoor exercise
6. Provides progression and modification options

For each exercise suggested, include:
- Exercise name and type
- Duration or reps/sets
- Key form points and safety tips
- Equipment needed
- Modification options if needed
- Intensity level guidance

Always prioritize safety. If any exercises might be risky given their constraints, clearly explain why and suggest safer alternatives.

Keep the response encouraging and professional.`

      return yield* Effect.tryPromise({
        try: () =>
          llmService.generateText(responsePrompt, {
            systemPrompt: AGENT_SYSTEM_PROMPTS.EXERCISE_COACH,
            temperature: 0.7
          }),
        catch: (error) => new Error(`Failed to generate response: ${error}`)
      })
    })
  }
}

export class LogisticsAgentService implements AgentService {
  processMessage(
    conversation: AgentConversation,
    userMessage: string,
    context?: Record<string, unknown>
  ): Effect.Effect<string, unknown, unknown> {
    return Effect.gen(function* () {
      const llmService = yield* LLMService

      // Extract logistics information from user message
      const logisticsInfo = yield* Effect.tryPromise({
        try: () =>
          llmService
            .generateObject(
              `Extract logistics information from this user message: "${userMessage}".
          Return a JSON object with these fields if present:
          - ingredientsNeeded: array of ingredients they need to find
          - location: string describing their location or area
          - preferredStores: array of preferred store types (e.g., ["WHOLE_FOODS", "COSTCO", "LOCAL_GROCERY"])
          - budget: string describing budget constraints
          - timeConstraint: string describing time constraints
          - transportation: string describing transportation available
          - specialRequests: array of special requests or preferences
          
          Only include fields that are clearly mentioned or can be reasonably inferred.`,
              {
                schema: {
                  type: 'object',
                  properties: {
                    ingredientsNeeded: {
                      type: 'array',
                      items: { type: 'string' }
                    },
                    location: { type: 'string' },
                    preferredStores: {
                      type: 'array',
                      items: { type: 'string' }
                    },
                    budget: { type: 'string' },
                    timeConstraint: { type: 'string' },
                    transportation: { type: 'string' },
                    specialRequests: {
                      type: 'array',
                      items: { type: 'string' }
                    }
                  },
                  additionalProperties: false
                }
              }
            )
            .then((result: any) => result),
        catch: () => Effect.succeed({}) as any
      })

      // Generate logistics response
      const responsePrompt = `You are the Logistics Agent for NoraHealth. Based on this logistics information:

${JSON.stringify(logisticsInfo, null, 2)}

User's original message: "${userMessage}"

Generate a helpful, practical response that:
1. Suggests specific stores or locations where they can find the needed ingredients
2. Provides practical shopping tips and strategies
3. Considers their preferences and constraints (budget, time, transportation)
4. Suggests alternatives if ingredients might be hard to find
5. Provides route optimization tips if multiple stores needed
6. Includes timing considerations (store hours, best times to shop)

For each store suggestion, include:
- Store type/name
- Likely availability of ingredients
- Estimated pricing tier (budget-friendly, mid-range, premium)
- Shopping tips specific to that store
- Alternative store options if primary choice doesn't work

If location is provided, give location-specific suggestions. If not, provide general guidance on finding these ingredients locally.

Keep the response practical, helpful, and action-oriented.`

      return yield* Effect.tryPromise({
        try: () =>
          llmService.generateText(responsePrompt, {
            systemPrompt: AGENT_SYSTEM_PROMPTS.LOGISTICS,
            temperature: 0.7
          }),
        catch: (error) => new Error(`Failed to generate response: ${error}`)
      })
    })
  }
}

// Agent service factory
export const createAgentService = (agentType: string): AgentService => {
  switch (agentType) {
    case 'INTAKE_SAFETY':
      return new IntakeSafetyAgentService()
    case 'MEAL_PLANNER':
      return new MealPlannerAgentService()
    case 'EXERCISE_COACH':
      return new ExerciseCoachAgentService()
    case 'LOGISTICS':
      return new LogisticsAgentService()
    default:
      throw new Error(`Unknown agent type: ${agentType}`)
  }
}

// Layer for providing agent services
export const AgentServiceLive = Layer.succeed(
  AgentService,
  new IntakeSafetyAgentService()
)
