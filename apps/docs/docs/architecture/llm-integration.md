# LLM Integration

## Overview

NoraHealth uses `@effect/ai` and `@effect/ai-google` to integrate Large Language Models (LLMs) across all agents. This provides a unified interface for text generation, structured data extraction, and vision capabilities.

## Architecture

```
┌─────────────────────────────────────────────┐
│         LLM Service Layer              │
│      (@effect/ai integration)          │
└─────────────┬───────────────────────────┘
              │
     ┌────────┼────────┐
     │        │        │
┌────▼────┐  ┌──▼────┐ ┌▼────────┐
│  Gemini  │  │   GLM   │ │ Provider │
│  Provider│  │ Provider│ │Selector │
└────┬────┘  └──┬────┘ └──────────┘
     │           │
     └─────┬─────┘
           │
┌──────────▼──────────────────────────────────┐
│     Unified LLM Service Interface        │
└──────────┬───────────────────────────────┘
           │
     ┌─────┼─────┬──────┬──────┐
     │     │     │      │      │
┌────▼───┐ ┌─▼───┐ ┌▼───┐ ┌▼──────┐
│Intake    │ │Meal   │ │Exer-│ │Logis-  │
│& Safety  │ │Planner│ │cise  │ │tics    │
│  Agent   │ │ Agent  │ │Coach│ │Agent    │
└──────────┘ └───────┘ └─────┘ └─────────┘
```

## LLM Service Interface

### Unified API

All agents interact with LLMs through a single, typed interface:

```typescript
export class LLMService extends Context.Tag('LLMService')<LLMService, {
  chat: (
    messages: Message[],
    options?: ChatOptions
  ) => Effect.Effect<TextCompletion, LLMError>

  chatJSON: <T>(
    messages: Message[],
    schema: Schema<T>
  ) => Effect.Effect<T, LLMError>

  analyzeImage: (
    imageBase64: string,
    prompt: string
  ) => Effect.Effect<ImageAnalysis, LLMError>
}>() {}
```

### Message Type

```typescript
type Message = {
  role: 'user' | 'assistant' | 'system'
  content: string
  attachments?: ImageAttachment[]
}
```

### Options

```typescript
type ChatOptions = {
  temperature?: number          // Default: 0.7
  maxTokens?: number          // Default: 2048
  model?: string             // Override default model
  responseFormat?: 'text' | 'json'
}
```

## Providers

### Gemini 2.5 Flash

**Primary Provider**: Used for most operations (chat, JSON, vision)

**Models**:
- `gemini-2.5-flash` - Fast, cost-effective for most operations
- `gemini-2.5-flash-vision` - Image analysis with vision capabilities
- `gemini-2.5-pro` - Higher quality for complex tasks (optional)

**Capabilities**:
- Text generation
- Structured JSON output
- Multi-image vision analysis
- Function calling

**Configuration**:

```typescript
const geminiProvider = Layer.effect(
  LLMService,
  Effect.gen(function* () {
    const config = yield* AppConfig

    const googleAI = GoogleAI.Gemini.make({
      apiKey: config.llm.gemini.apiKey,
      model: GoogleAI.Gemini.Models.Gemini2_5FlashVision
    })

    return LLMService.of({
      chat: (messages, options) =>
        AI.chat(googleAI)(messages, {
          ...options,
          temperature: options?.temperature ?? 0.7,
          maxTokens: options?.maxTokens ?? 2048
        }),

      chatJSON: <T>(messages, schema) =>
        AI.chat(googleAI, JSON)(messages, options)
          .pipe(
            Effect.map(JSON.parse),
            Effect.flatMap(Schema.decode(schema))
          ),

      analyzeImage: (imageBase64, prompt) =>
        AI.chat(googleAI)([
          AI.user({
            content: [
              AI.text(prompt),
              AI.image({
                image: imageBase64,
                mediaType: 'image/jpeg'
              })
            ]
          })
        ])
    })
  })
)
```

### GLM (Z.AI)

**Secondary Provider**: Alternative to Gemini, configurable via environment

**Models**:
- `glm-4-flash` - Fast, efficient
- `glm-4-plus` - Higher quality

**Capabilities**:
- Text generation
- Structured JSON output
- Vision (limited support)

**Configuration**:

```typescript
const glmProvider = Layer.effect(
  LLMService,
  Effect.gen(function* () {
    const config = yield* AppConfig

    // Note: @effect/ai-glm would be used
    // This is placeholder for GLM integration
    return LLMService.of({
      chat: (messages, options) => {
        // GLM implementation
      },
      chatJSON: <T>(messages, schema) => {
        // GLM JSON implementation
      },
      analyzeImage: (imageBase64, prompt) => {
        // GLM vision implementation
      }
    })
  })
)
```

### Provider Selection

```typescript
export const LLMProviderLayer = Layer.effect(
  LLMService,
  Effect.gen(function* () {
    const config = yield* AppConfig

    return yield* match(config.llm.provider)
      .with('gemini', () => LLMGeminiLive)
      .with('glm', () => LLMGLMLive)
      .exhaustive()
  })
)
```

## Usage Patterns

### 1. Chat Generation

Use for conversational responses.

**Intake & Safety Agent**:
```typescript
const generateOnboardingQuestion = (context: OnboardingContext) =>
  Effect.gen(function* () {
    const llm = yield* LLMService

    const prompt = buildOnboardingPrompt(context)

    const response = yield* llm.chat([
      {
        role: 'system',
        content: 'You are a helpful wellness assistant conducting guided onboarding.'
      },
      {
        role: 'user',
        content: prompt
      }
    ], {
      temperature: 0.7,
      maxTokens: 500
    })

    return response.content
  })
```

### 2. Structured Data Extraction

Use for extracting structured information from user input.

**Intake & Safety Agent**:
```typescript
const extractHealthProfile = (conversation: string) =>
  Effect.gen(function* () {
    const llm = yield* LLMService

    const schema = Schema.Struct({
      resolutionClass: Schema.Literal('PERFORMANCE', 'VITALITY', 'LONGEVITY'),
      dietaryExclusions: Schema.Array(
        Schema.Literal('DAIRY', 'GLUTEN', 'PEANUTS', 'SOY', 'EGGS', 'SHELLFISH')
      ),
      physicalConstraints: Schema.Array(
        Schema.Struct({
          type: Schema.Literal('KNEE', 'BACK', 'SHOULDER', 'HIP', 'ANKLE'),
          description: Schema.String
        })
      ),
      fitnessGoals: Schema.Array(Schema.String),
      fitnessLevel: Schema.Literal('BEGINNER', 'INTERMEDIATE', 'ADVANCED')
    })

    const response = yield* llm.chatJSON([
      {
        role: 'system',
        content: 'Extract health profile information from user response. Return JSON.'
      },
      {
        role: 'user',
        content: conversation
      }
    ], schema)

    return response // Type-safe: { resolutionClass, dietaryExclusions, ... }
  })
```

### 3. Vision Analysis

Use for analyzing fridge photos.

**Meal Planner Agent**:
```typescript
const analyzeFridgePhoto = (imageBase64: string) =>
  Effect.gen(function* () {
    const llm = yield* LLMService

    const schema = Schema.Struct({
      ingredients: Schema.Array(
        Schema.Struct({
          name: Schema.String,
          quantity: Schema.String,
          estimatedFreshness: Schema.Literal('FRESH', 'GOOD', 'AGING', 'EXPIRED')
        })
      ),
      mealSuggestions: Schema.Array(Schema.String)
    })

    const prompt = 'List all visible food ingredients in this refrigerator. Include names and estimated quantities.'

    const response = yield* llm.analyzeImage(imageBase64, prompt)

    return response // Type-safe: { ingredients: [...], mealSuggestions: [...] }
  })
```

### 4. Recipe Generation

Use for generating personalized recipes.

**Meal Planner Agent**:
```typescript
const generateRecipes = (
  availableIngredients: string[],
  dietaryExclusions: DietaryExclusion[],
  fitnessGoal: ResolutionClass
) =>
  Effect.gen(function* () {
    const llm = yield* LLMService

    const schema = Schema.Struct({
      recipes: Schema.Array(
        Schema.Struct({
          name: Schema.String,
          ingredients: Schema.Array(Schema.String),
          instructions: Schema.Array(Schema.String),
          calories: Schema.Number,
          protein: Schema.Number,
          carbs: Schema.Number,
          fat: Schema.Number,
          prepTimeMinutes: Schema.Number
        })
      )
    })

    const prompt = buildRecipePrompt(availableIngredients, dietaryExclusions, fitnessGoal)

    const response = yield* llm.chatJSON(
      [{ role: 'user', content: prompt }],
      schema
    )

    return response.recipes
  })
```

### 5. Workout Adaptation

Use for adapting workouts based on conditions.

**Exercise Coach Agent**:
```typescript
const adaptWorkoutForWeather = (
  workout: Workout,
  weather: WeatherCondition
) =>
  Effect.gen(function* () {
    const llm = yield* LLMService

    const schema = Schema.Struct({
      modifiedExercises: Schema.Array(ExerciseSchema),
      notes: Schema.String,
      estimatedIntensity: Schema.Literal('LOW', 'MEDIUM', 'HIGH')
    })

    const prompt = `Adapt this workout for ${weather.condition} weather:
${JSON.stringify(workout)}`

    const response = yield* llm.chatJSON(
      [{ role: 'user', content: prompt }],
      schema
    )

    return response
  })
```

## Error Handling

### LLM Error Types

```typescript
export class LLMError extends Data.TaggedError('LLMError')<{
  message: string
  type: LLMErrorType
  cause?: unknown
}>()

export type LLMErrorType =
  | 'API_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INVALID_API_KEY'
  | 'CONTENT_FILTERED'
  | 'TIMEOUT'
  | 'INVALID_RESPONSE'
```

### Error Handling Pattern

```typescript
const handleLLMCall = <A>(effect: Effect.Effect<A, LLMError>) =>
  Effect.gen(function* () {
    const result = yield* effect.pipe(
      Effect.catchTags({
        LLMRateLimitError: (error) =>
          Effect.retry(effect, {
            schedule: Schedule.exponential('100 millis'),
            while: (e) => e._tag === 'LLMRateLimitError',
            times: 3
          }),
        LLMTimeoutError: (error) =>
          Effect.fail(new LLMError({
            message: 'LLM request timed out',
            type: 'TIMEOUT',
            cause: error
          })),
        LLMContentFilteredError: (error) =>
          Effect.fail(new LLMError({
            message: 'LLM content was filtered',
            type: 'CONTENT_FILTERED',
            cause: error
          }))
      })
    )

    return result
  })
```

## Performance Optimization

### Caching

**Response Caching**:
```typescript
const cache = new Map<string, Effect.Effect<any, LLMError>>()

const cachedLLMCall = <A>(
  key: string,
  effect: Effect.Effect<A, LLMError>
) =>
  Effect.gen(function* () {
    if (cache.has(key)) {
      return yield* cache.get(key)
    }

    const result = yield* effect
    cache.set(key, Effect.succeed(result))
    return result
  })
```

**Cache Strategies**:
- **Recipe Templates**: Cache common recipe patterns
- **Workout Routines**: Cache workout templates by type/level
- **Ingredient Analysis**: Cache pantry item classifications
- **TTL**: 30 minutes for most caches

### Batching

**Batch LLM Calls**:
```typescript
const generateDailyContent = (userId: string) =>
  Effect.gen(function* () {
    // Batch multiple LLM calls into one
    const prompt = buildMultiPrompt([
      'Generate 3 recipes',
      'Generate 1 workout',
      'Generate motivational message'
    ])

    const response = yield* llm.chat([{ role: 'user', content: prompt }])

    return parseMultiResponse(response.content)
  })
```

### Streaming

For long-form content (future enhancement):
```typescript
const streamResponse = (prompt: string) =>
  Effect.gen(function* () {
    const llm = yield* LLMService

    // Future: Use @effect/ai streaming capabilities
    return llm.stream([{ role: 'user', content: prompt }])
  })
```

## Configuration

### Environment Variables

```env
# LLM Provider Selection
LLM_PROVIDER=gemini  # Options: gemini, glm

# Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key

# GLM Configuration (if using GLM)
GLM_API_KEY=your_glm_api_key

# Model Configuration (optional overrides)
GEMINI_MODEL=gemini-2.5-flash-vision
GLM_MODEL=glm-4-flash
```

### Config Schema

```typescript
export const LLMConfigSchema = Schema.Struct({
  provider: Schema.Literal('gemini', 'glm'),
  gemini: Schema.Struct({
    apiKey: Schema.String,
    model: Schema.String,  // Default: gemini-2.5-flash-vision
    temperature: Schema.Number,  // Default: 0.7
    maxTokens: Schema.Number  // Default: 2048
  }),
  glm: Schema.Struct({
    apiKey: Schema.String,
    model: Schema.String,  // Default: glm-4-flash
    temperature: Schema.Number,
    maxTokens: Schema.Number
  })
})
```

## Monitoring

### Metrics Tracking

For each LLM call:
- **Response Time**: Time to receive response
- **Token Usage**: Input/output tokens
- **Cost**: Calculated cost per call
- **Success Rate**: Percentage of successful calls
- **Error Types**: Distribution of error types

### Observability

Log via OpenTelemetry:
```typescript
const instrumentLLMCall = <A>(
  operation: string,
  effect: Effect.Effect<A, LLMError>
) =>
  Effect.gen(function* () {
    const start = Date.now()

    const result = yield* effect.pipe(
      Effect.tapBoth({
        onSuccess: (value) => {
          const duration = Date.now() - start
          Logger.info(`LLM ${operation} success`, { duration })
        },
        onFailure: (error) => {
          const duration = Date.now() - start
          Logger.error(`LLM ${operation} failed`, { duration, error: error._tag })
        }
      })
    )

    return result
  })
```

## Best Practices

### 1. Schema Validation

Always use `chatJSON` for structured output:
```typescript
// ✅ Good - Type-safe
const result = yield* llm.chatJSON(messages, RecipeSchema)

// ❌ Bad - Manual parsing
const response = yield* llm.chat(messages)
const parsed = JSON.parse(response.content)  // No type safety
```

### 2. Prompt Engineering

Use clear, structured prompts:
```typescript
const prompt = `
You are a nutritionist. Generate 3 recipes based on these constraints:
- Available ingredients: ${ingredients.join(', ')}
- Dietary exclusions: ${exclusions.join(', ')}
- Fitness goal: ${goal}

Return JSON in this exact format:
{
  "recipes": [
    {
      "name": "string",
      "ingredients": ["string"],
      "instructions": ["string"],
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number,
      "prepTimeMinutes": number
    }
  ]
}
`
```

### 3. Error Recovery

Implement fallback behavior:
```typescript
const generateWithFallback = (prompt: string) =>
  Effect.gen(function* () {
    const result = yield* llm.chat([prompt]).pipe(
      Effect.catchTag('LLMError', (error) => {
        Logger.warn('LLM failed, using fallback', { error: error.message })
        return fallbackResponse(prompt)
      })
    )

    return result
  })
```

### 4. Context Management

Maintain conversation context:
```typescript
const buildMessages = (history: Message[], newMessage: string) => [
  {
    role: 'system',
    content: buildSystemPrompt()
  },
  ...history.slice(-5),  // Last 5 messages for context
  {
    role: 'user',
    content: newMessage
  }
]
```

### 5. Vision Specifics

For image analysis:
- **Image Format**: Base64 encoded JPEG
- **Image Size**: Resize large images to < 4MB
- **Prompt Clarity**: Be specific about what to identify
- **Batch Processing**: Analyze multiple images if needed

## Future Enhancements

### Planned Improvements
- **Streaming Responses**: For real-time chat experience
- **Function Calling**: For structured API interactions
- **Multi-Image Vision**: Analyze multiple photos in one call
- **Fine-Tuning**: Custom models on NoraHealth data
- **Cost Optimization**: Choose optimal model per task

---

## Summary

NoraHealth's LLM integration provides:

- **Unified Interface**: Single service for all LLM operations
- **Multiple Providers**: Gemini 2.5 Flash and GLM support
- **Type Safety**: Schema-based JSON extraction
- **Vision Capabilities**: Gemini 2.5 Flash Vision for image analysis
- **Error Handling**: Comprehensive error types with retry logic
- **Performance**: Caching, batching, streaming (planned)
- **Observability**: Full monitoring of LLM calls
- **@effect/ai Integration**: Seamless Effect-based usage

This architecture enables all agents to leverage LLM capabilities reliably, efficiently, and with type safety throughout the system.
