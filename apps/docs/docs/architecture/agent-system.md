# Agent System

## Overview

NoraHealth's multi-agent architecture is built using `@effect/ai` and `@effect/ai-google` to provide personalized wellness guidance through four specialized AI agents. Each agent has a unique role, specialized capabilities, and clear responsibilities, with orchestration managing hand-offs and context sharing.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Agent Orchestration Layer                      │
│                  (@effect/ai integration)                         │
└────────────────────────┬────────────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┬─────────────┐
         │             │             │             │
    ┌────▼────┐  ┌───▼────┐  ┌───▼────┐  ┌──▼──────┐
    │ Intake & │  │  Meal   │  │Exercise  │  │ Logistics │
    │ Safety   │  │ Planner  │  │  Coach  │  │          │
    │  Agent   │  │  Agent   │  │ Agent   │  │  Agent   │
    └────┬────┘  └───┬────┘  └───┬────┘  └───┬──────┘
         │             │             │             │
         └─────────────┼─────────────┴─────────────┘
                       │
                   ┌───▼────┐
                   │  User   │
                   │  DB &   │
                   │ Context │
                   └─────────┘
```

## Agents

### 1. Intake & Safety Agent (The Gatekeeper)

**Role**: First point of contact for new users, and validator for all AI-generated plans.

**Responsibilities**:
- Conduct empathetic, guided onboarding conversations
- Extract structured health data (allergies, injuries, goals)
- Validate user-provided information
- Cross-reference every plan against medical "redlines"
- Trigger "Health Alert" interventions for unsafe recommendations
- Maintain user's safety profile

**Capabilities**:
- Natural language understanding for health goal extraction
- Structured data extraction (Resolution Class, constraints, goals)
- Safety validation logic
- Health risk assessment

**Integration Points**:
- Called during onboarding flow
- Validates Meal Planner output (checks dietary exclusions)
- Validates Exercise Coach output (checks physical constraints)
- Updates HealthProfile in database

**Example Flow**:
```typescript
// User onboarding
user: "I want to build muscle but I have a bad knee from soccer"

// Intake & Safety Agent
agent: "Got it! Let me understand your situation better.
       I'll note the knee constraint and help you with performance-focused goals."

// Structured extraction
{
  resolutionClass: "PERFORMANCE",
  physicalConstraints: ["KNEE"],
  fitnessGoals: ["MUSCLE_GAIN"],
  fitnessLevel: "INTERMEDIATE"
}
```

### 2. Meal Planner Agent (The Nutritionist)

**Role**: Creates personalized nutrition plans based on user preferences, pantry inventory, and health constraints.

**Responsibilities**:
- Analyze fridge/pantry photos via vision
- Generate personalized recipes
- Create daily and weekly meal plans
- Respect dietary exclusions from Safety Agent
- Adjust recipes based on user feedback

**Capabilities**:
- **Vision Analysis**: Gemini 2.5 Flash Vision for ingredient detection
- Recipe generation with nutrition info (calories, protein, carbs, fat)
- Dietary restriction handling
- Ingredient substitution suggestions

**Integration Points**:
- Intake & Safety Agent provides dietary exclusions
- Vision service analyzes uploaded photos
- Pantry inventory provides available ingredients
- Creates recipes and meal plans in database

**Example Flow**:
```typescript
// User uploads fridge photo
user: [uploads photo]

// Meal Planner Agent
agent: "I see: spinach (3 cups), eggs (6), half onion, greek yogurt, chicken breast.
       Based on your PERFORMANCE goal and KNEE constraint, here's a post-workout meal:

       🥗 High-Protein Recovery Bowl
       - Grilled chicken (150g)
       - Spinach salad with greek yogurt dressing
       - Hard-boiled eggs (2)
       - Nutrition: 450 cal, 45g protein"
```

### 3. Exercise Coach Agent (The Personal Trainer)

**Role**: Builds adaptive workout routines that respond to user progress, environment, and physical constraints.

**Responsibilities**:
- Generate personalized workout routines
- Check local weather conditions (OpenWeather API)
- Adapt workouts between indoor/outdoor based on weather
- Adjust intensity based on historical progress and reported soreness
- Respect physical constraints from Safety Agent

**Capabilities**:
- Workout generation by type (cardio, strength, HIIT, etc.)
- Weather-aware adaptation
- Progress-based intensity adjustment
- Injury modifications for exercises

**Integration Points**:
- Intake & Safety Agent provides physical constraints
- OpenWeather API provides local conditions
- Progress tracking provides soreness history
- Creates workouts and sessions in database
- Sends notifications via Firebase

**Example Flow**:
```typescript
// Morning check (7:00 AM)
weather: { condition: "RAIN", temp: 12°C }

// Exercise Coach Agent
agent: "It's raining in Lagos today! 🌧️
       I've swapped your park run for a 20-minute living room HIIT circuit.
       Focus: Upper body (knee-friendly)"
```

### 4. Logistics Agent (The Personal Shopper)

**Role**: Connects meal plans to real-world ingredient availability.

**Responsibilities**:
- Identify missing ingredients from meal plans
- Find nearby grocery stores with those ingredients
- Provide store locations via Google Maps
- Suggest alternatives if ingredient not available nearby

**Capabilities**:
- Ingredient availability checking
- Store location search (Google Maps/Places API)
- Alternative ingredient suggestions
- Store information (hours, ratings)

**Integration Points**:
- Meal Planner Agent provides ingredient lists
- Pantry inventory provides already-owned items
- Google Maps API provides store locations
- Displays on frontend marketplace

**Example Flow**:
```typescript
// Meal plan requires almond flour
user: "I need almond flour for the pancakes"

// Logistics Agent
agent: "Found almond flour at 3 nearby stores:

       🛒 Spar (Main St) - 2.3km away - $8.99
       🛒 Whole Foods (Market) - 3.1km away - $12.50
       🛒 Trader Joe's (Broadway) - 4.2km away - $7.49

       Trader Joe's has the best price and is open until 9 PM today!"
```

## Agent Orchestration

### Hand-Off Mechanism

Agents communicate through a centralized orchestration layer that manages:

1. **Conversation Context**: Shared state across all agents
2. **Agent Routing**: Determines which agent should handle a request
3. **Context Passing**: Transfers relevant information between agents

### Orchestration Pattern

```typescript
export const AgentOrchestrationService = Context.Tag('AgentOrchestrationService')

const handleUserMessage = (userId: string, message: string) =>
  Effect.gen(function* () {
    const conversation = yield* AgentConversationRepository.findByUserId(userId)
    const context = conversation?.context ?? {}

    // Determine which agent should handle
    const currentAgent = determineAgent(message, context, conversation?.agent_type)

    // Route to appropriate agent
    const result = yield* match(currentAgent)
      .with('INTAKE_SAFETY', () =>
        intakeSafetyService.handle(userId, message, context)
      )
      .with('MEAL_PLANNER', () =>
        mealPlannerService.handle(userId, message, context)
      )
      .with('EXERCISE_COACH', () =>
        exerciseCoachService.handle(userId, message, context)
      )
      .with('LOGISTICS', () =>
        logisticsService.handle(userId, message, context)
      )
      .exhaustive()

    // Update conversation with new context
    yield* AgentConversationRepository.update(conversation.id, {
      context: result.context,
      agent_type: currentAgent
    })

    return result.response
  })
```

### Context Structure

```typescript
type AgentContext = {
  // Health profile (from Intake & Safety)
  healthProfile?: {
    resolutionClass: ResolutionClass
    dietaryExclusions: DietaryExclusion[]
    physicalConstraints: PhysicalConstraint[]
    fitnessLevel: FitnessLevel
  }

  // Pantry state (from Meal Planner)
  pantry?: {
    ingredients: string[]
    lastUpdated: Timestamp
  }

  // Workout state (from Exercise Coach)
  workout?: {
    currentWorkoutId: string
    completedDays: number
    lastSorenessLevel: SorenessLevel
  }

  // Location (from user)
  location?: {
    city: string
    zipCode: string
    lat?: number
    lng?: number
  }

  // Weather state (from Exercise Coach)
  weather?: {
    condition: WeatherCondition
    temperature: number
    lastChecked: Timestamp
  }
}
```

## @effect/ai Integration

### LLM Service Abstraction

The LLM service provides a unified interface for all agents:

```typescript
export class LLMService extends Context.Tag('LLMService')<LLMService, {
  chat: (messages: Message[], options?: ChatOptions) => Effect.Effect<TextCompletion>
  chatJSON: <T>(messages: Message[], schema: Schema<T>) => Effect.Effect<T>
  analyzeImage: (imageBase64: string, prompt: string) => Effect.Effect<ImageAnalysis>
}>() {}
```

### Provider Configuration

```typescript
// Config-based provider selection
const LLMProviderLayer = Layer.effect(
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

### Agent LLM Usage

Each agent uses the LLM service for different purposes:

**Intake & Safety Agent**:
```typescript
const extractHealthProfile = (conversation: string) =>
  Effect.gen(function* () {
    const llm = yield* LLMService

    return llm.chatJSON(conversation, HealthProfileExtractionSchema)
  })
```

**Meal Planner Agent**:
```typescript
const analyzeFridgePhoto = (imageBase64: string) =>
  Effect.gen(function* () {
    const llm = yield* LLMService

    return llm.analyzeImage(imageBase64, 'List all food ingredients visible in this image.')
  })
```

**Exercise Coach Agent**:
```typescript
const adaptWorkoutForWeather = (workout: Workout, weather: WeatherCondition) =>
  Effect.gen(function* () {
    const llm = yield* LLMService

    const prompt = `Adapt this workout for ${weather.condition} weather:
${JSON.stringify(workout)}`

    return llm.chatJSON(prompt, WorkoutSchema)
  })
```

## Safety Protocol

### Redline Checking

The Intake & Safety Agent maintains a list of medical "redlines":

```typescript
type MedicalRedlines = {
  chronicConditions: string[]
  medications: string[]
  allergies: DietaryExclusion[]
  injuries: PhysicalConstraint[]
}

const validatePlan = (plan: MealPlan | Workout, redlines: MedicalRedlines) => {
  const violations = []

  if (plan instanceof MealPlan) {
    plan.ingredients.forEach(ingredient => {
      if (redlines.allergies.includes(ingredient)) {
        violations.push(`Contains allergen: ${ingredient}`)
      }
    })
  }

  if (plan instanceof Workout) {
    plan.exercises.forEach(exercise => {
      if (exercise.requiresBodyPart(redlines.injuries)) {
        violations.push(`Contraindicated for injury: ${exercise.name}`)
      }
    })
  }

  return violations.length === 0
    ? success(plan)
    : fail(new HealthAlertError({ violations }))
}
```

### Health Alert Intervention

When an unsafe recommendation is detected:

```typescript
if (!validatePlan(plan, userRedlines)) {
  yield* FirebaseService.sendNotification(userId, {
    title: '⚠️ Health Alert',
    body: 'We paused this recommendation due to your health constraints.',
    action: 'VIEW_DETAILS'
  })

  return {
    response: 'I\'ve paused this recommendation because it conflicts with your knee injury. Here\'s a knee-safe alternative...',
    requiresAcknowledgment: true
  }
}
```

## Agent Communication Flow

### Complete Onboarding Journey

```
1. User → "I want to get fit, help me"
   ↓
   Intake & Safety Agent → "I'd love to help! A few questions:
   ↓                    What's your primary goal? Performance, Vitality, or Longevity?"
2. User → "Performance - build muscle"
   ↓
   Intake & Safety Agent → "Great! Any injuries or constraints?"
3. User → "Bad knee from soccer"
   ↓
   Intake & Safety Agent → "Noted. Any allergies?"
4. User → "None"
   ↓
   Intake & Safety Agent → "Got it! What's your location for weather-based workouts?"
5. User → "Lagos, Nigeria"
   ↓
   Intake & Safety Agent → Creates HealthProfile
   ↓
   Orchestration → Updates conversation context
   ↓
   System → Welcome user to dashboard
```

### Fridge-to-Table Journey

```
1. User → [uploads fridge photo]
   ↓
   Storage Service → Saves image
   ↓
   Meal Planner Agent → Analyzes image with vision
   ↓                      "I see: spinach, eggs, onion, yogurt"
   ↓
   Meal Planner Agent → Checks dietary exclusions from context
   ↓
   Meal Planner Agent → Generates 3 recipes using pantry items
   ↓
   Meal Planner Agent → Creates recipes in database
   ↓
   Frontend → Displays recipes with "Cook Now" buttons
```

### Morning Workout Adaptation

```
1. Cron Job (7:00 AM) → Triggered
   ↓
   Exercise Coach Agent → Gets all users with outdoor workouts today
   ↓
   OpenWeather API → Check weather for each user's location
   ↓
   Exercise Coach Agent → For users with poor weather:
   ↓                     Generate indoor alternative workout
   ↓                     Update workout in database
   ↓
   Firebase Service → Send notification:
                     "It's raining! I've swapped your run for indoor HIIT."
```

## Error Handling

### Agent-Specific Errors

Each agent defines its own error types:

```typescript
// Intake & Safety Agent
export class HealthProfileValidationError extends Data.TaggedError(
  'HealthProfileValidationError'
)<{ fields: string[] }>()

// Meal Planner Agent
export class RecipeGenerationError extends Data.TaggedError(
  'RecipeGenerationError'
)<{ reason: string }>()

// Exercise Coach Agent
export class WorkoutAdaptationError extends Data.TaggedError(
  'WorkoutAdaptationError'
)<{ weather: WeatherCondition }>()

// Logistics Agent
export class StoreNotFoundError extends Data.TaggedError(
  'StoreNotFoundError'
)<{ ingredient: string }>()
```

### Fallback Behavior

When an agent fails:

```typescript
const handleAgentFailure = (error: AgentError) =>
  Effect.gen(function* () {
    yield* Logger.error(`Agent error: ${error._tag}`)

    return yield* match(error._tag)
      .with('RecipeGenerationError', () =>
        fallbackToRecipeLibrary(error.context)
      )
      .with('WorkoutAdaptationError', () =>
        useStandardWorkoutLibrary(error.context)
      )
      .otherwise(() =>
        genericErrorResponse("I'm having trouble right now. Try again?")
      )
  })
```

## Performance Optimization

### Caching

- **LLM Responses**: Cache common recipe/workout patterns
- **Weather Data**: Cache for 30 minutes
- **Store Locations**: Cache for 1 hour

### Batching

- **Morning Weather Checks**: Batch all users into single API call
- **Ingredient Lookups**: Batch multiple ingredients in one search

### Async Processing

- **Recipe Generation**: Run in background, notify user when ready
- **Large Image Processing**: Stream processing for better UX

## Monitoring

### Agent Metrics

Track for each agent:
- Response time
- Success rate
- Error types
- LLM token usage
- User satisfaction (feedback)

### Observability

All agent decisions logged via OpenTelemetry:
- Which agent handled request
- Context used
- LLM prompts and responses (for debugging)
- Safety validation results

## Summary

The NoraHealth agent system provides:

- **Specialized Agents**: Four AI agents with distinct roles
- **Orchestration**: Centralized hand-off management
- **Context Sharing**: Shared state across agents
- **Safety First**: Validation against health profile
- **Vision-Powered**: Fridge photo analysis
- **Weather-Adaptive**: Real-time workout adjustment
- **@effect/ai Integration**: Seamless LLM usage
- **Error Resilience**: Fallback behaviors and retries
- **Observability**: Full tracing of agent decisions

This architecture enables NoraHealth to provide personalized, safe, and context-aware wellness guidance through intelligent agent collaboration.
