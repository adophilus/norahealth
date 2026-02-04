# Feature Overview

## Core Features

NoraHealth provides a comprehensive wellness platform powered by multi-agent AI system. Features are organized around user journey: onboarding, daily wellness activities, progress tracking, and personalized recommendations.

## 1. Onboarding & Health Profile

### Purpose
Guide new users through structured health profile creation to enable personalized recommendations.

### User Flow

```
Sign Up → Health Profile Form → Safety Validation → Dashboard
            ↓
    Resolution Class Selection
            ↓
    Physical Constraints (Injuries)
            ↓
    Dietary Exclusions (Allergens)
            ↓
    Medical Redlines (Chronic Conditions)
            ↓
    Fitness Goals & Level
            ↓
    Location Permission (Weather/Marketplace)
```

### Key Components

#### Resolution Classes
- **Performance** - Muscle gain, athletic training, strength focus
- **Vitality** - Weight loss, metabolic health, energy optimization
- **Longevity** - Mobility, stress management, heart health, flexibility

#### Safety Vault Form
- **Physical Constraints**: Multi-select for injuries (Knee, Back, Shoulder, Hip, etc.)
  - Text input for "Other" injuries
  - Severity indicators
- **Dietary Exclusions**: Checkboxes for common allergens
  - Peanuts, Dairy, Gluten, Soy, Eggs, Shellfish, Tree Nuts, Fish
  - "Medical Redline" field for chronic conditions
- **Fitness Level**: Beginner, Intermediate, Advanced

#### Environmental Sync
- One-tap location permission
- Captures city and zip code
- Enables:
  - Weather-based workout adaptation
  - Marketplace store location
  - Local ingredient sourcing

### API Endpoints

```
PUT /user/onboarding - Complete onboarding with health profile data
```

### Agent Involvement

**Intake & Safety Agent**:
- Validates all health profile data
- Extracts structured information from conversational input
- Detects unsafe goals (e.g., "lose 20 lbs in 2 weeks")
- Creates structured HealthProfile in database

### Safety Features

- **Medical Redlines**: Chronic conditions that require special handling
- **Goal Validation**: Unrealistic goals trigger health alerts
- **Injury Documentation**: Detailed injury history for exercise modifications
- **Allergen Tracking**: Comprehensive dietary exclusion list

---

## 2. Fridge-to-Table Vision

### Purpose
Allow users to upload photos of their refrigerator/pantry to get personalized recipe suggestions using available ingredients.

### User Flow

```
Open Dashboard → Meals Tab → Upload Photo
                          ↓
                      Vision Analysis
                          ↓
                      Ingredient List
                          ↓
                  Select Available Ingredients
                          ↓
                      Recipe Suggestions
                          ↓
                  View Recipe Details
                          ↓
                      Add to Meal Plan
```

### Key Components

#### Image Upload
- Multi-part form upload
- Stores image in Storage table
- Returns image URL for analysis

#### Vision Analysis
- **Technology**: Gemini 2.5 Flash Vision
- **Output**: Structured list of ingredients
  - Name (e.g., "Spinach")
  - Quantity estimation (e.g., "3 cups")
  - Freshness indication (if visible)
- **Processing Time**: < 3 seconds

#### Ingredient Confirmation
- User sees detected ingredients
- Can edit/add/remove items
- Confirms pantry inventory state

#### Recipe Generation
- Uses confirmed ingredient list
- Respects dietary exclusions
- Generates 3-5 recipe options
- Includes nutrition information

### API Endpoints

```
POST /meals/upload-fridge-photo         - Upload and analyze photo
POST /meals/recipes/generate             - Generate recipes from ingredients
GET  /meals/recipes/:id                 - Get recipe details
POST /meals/recipes/:id/favorite        - Mark as favorite
```

### Agent Involvement

**Meal Planner Agent**:
- Analyzes uploaded photo via vision
- Generates recipes based on available ingredients
- Respects dietary exclusions from Intake & Safety Agent
- Provides alternative suggestions if limited ingredients

### Example Interaction

```
User: [uploads fridge photo]

Agent: "I can see:
      🥬 Spinach (about 3 cups)
      🥚 Eggs (6, looks fresh)
      🧅 Half onion
      🥛 Greek yogurt (1 container)

      Based on your PERFORMANCE goal and no allergies, here are recipes:

      1. 🥗 High-Protein Breakfast Scramble
         - Uses: Eggs, Spinach, Onion
         - 420 calories, 28g protein

      2. 🥗 Spinach & Yogurt Bowl
         - Uses: Spinach, Yogurt, Eggs
         - 350 calories, 22g protein

      3. 🥗 Greek Omelet with Greens
         - Uses: Eggs, Spinach, Onion
         - 450 calories, 30g protein"
```

---

## 3. Personalized Meal Plans

### Purpose
Generate daily and weekly meal plans tailored to user's health profile, fitness goals, and available ingredients.

### User Flow

```
Meals Tab → View Today's Plan → See Meals
             ↓                   ↓
         View Week              Meal Details
             ↓                   ↓
         Regenerate              Add Ingredients
             ↓                   ↓
         Customize               to Shopping List
```

### Key Components

#### Daily Meal Plan Structure
- **Breakfast**: High protein for energy
- **Lunch**: Balanced meal with carbs
- **Dinner**: Recovery-focused with protein
- **Snacks** (optional): Light options

#### Meal Plan Customization
- **Regenerate**: Get new meal plan for day/week
- **Swap**: Replace specific meal with alternative
- **Portion Adjustments**: Based on fitness goal
  - Performance: Larger portions, more protein
  - Vitality: Calorie-controlled portions
  - Longevity: Balanced macronutrients

#### Nutrition Tracking
- Calories per day
- Protein/Carb/Fat ratios
- Micronutrient highlights
- Progress toward daily goals

### API Endpoints

```
GET    /meals/meal-plans/:date        - Get meal plan for date
POST   /meals/meal-plans              - Generate new meal plan
PUT     /meals/meal-plans/:id          - Update meal plan
DELETE  /meals/meal-plans/:id          - Delete meal plan
GET     /meals/meal-plans/:id/nutrition - Get nutrition summary
```

### Agent Involvement

**Meal Planner Agent**:
- Generates meal plans based on health profile
- Optimizes for fitness goal
- Respects all dietary exclusions
- Uses pantry inventory to minimize shopping

**Intake & Safety Agent**:
- Validates meal plans against dietary restrictions
- Checks for allergens in generated recipes
- Blocks unsafe recommendations

---

## 4. Adaptive Workout System

### Purpose
Provide personalized workout routines that adapt to user's progress, physical constraints, and environmental conditions.

### User Flow

```
Workouts Tab → View Today's Workout → Start Session
                ↓                     ↓
            View Week               Track Exercises
                ↓                     ↓
            View History            Complete & Log
                                        ↓
                                    Report Soreness
```

### Key Components

#### Workout Types
- **Cardio**: Running, cycling, swimming, HIIT
- **Strength**: Weight training, resistance bands, bodyweight
- **Flexibility**: Yoga, stretching, mobility
- **HIIT**: High-intensity interval training
- **Compound**: Mixed workouts

#### Progress Tracking
- Completed sessions
- Duration tracking
- Soreness reporting (None, Mild, Moderate, Severe)
- Performance improvements (weights, reps, times)

#### Weather Adaptation
- **Morning Check**: Every day at 7:00 AM
- **Weather-Based Pivot**:
  - Rain/Snow → Indoor workout
  - Extreme heat → Indoor/early morning
  - Good weather → Outdoor workout
- **Notification**: Informs user of workout change

#### Injury Modifications
- **Knee**: Low-impact exercises, avoid jumping/squats
- **Back**: No heavy lifting, focus on core stability
- **Shoulder**: Modify pressing exercises, focus on pulling

### API Endpoints

```
POST   /workouts/generate                 - Generate workout
GET     /workouts/:id                     - Get workout details
POST   /workouts/sessions                 - Start workout session
PUT     /workouts/sessions/:id             - Complete session
POST   /workouts/check-weather            - Check weather for location
GET     /workouts/history/:userId           - Get workout history
```

### Agent Involvement

**Exercise Coach Agent**:
- Generates personalized workout routines
- Checks weather conditions (OpenWeather API)
- Adapts workouts for weather
- Adjusts intensity based on progress and soreness
- Provides injury modifications

**Intake & Safety Agent**:
- Validates workouts against physical constraints
- Blocks exercises that conflict with injuries
- Provides health alerts for unsafe routines

### Morning Pivot Example

```
Original Workout: Outdoor 5K Run
Weather: Rain, 12°C

Agent Action:
1. Detect poor weather
2. Generate indoor alternative
3. Update workout in database
4. Send notification

Notification:
"🌧️ It's raining in Lagos today!
I've swapped your park run for a 20-minute living room HIIT circuit.
Focus: Upper body (knee-friendly)"

Updated Workout:
- Warm-up: 5 min
- Circuit (3 rounds):
  - Push-ups: 15 reps
  - Dumbbell rows: 12 reps
  - Plank: 45 sec
- Cool-down: 5 min stretching
```

---

## 5. Marketplace & Ingredient Sourcing

### Purpose
Help users find where to buy ingredients needed for their meal plans, using their location to provide nearby store options.

### User Flow

```
Meal Details → Missing Ingredient → "Find Nearby"
                    ↓                    ↓
                Marketplace          Google Maps View
                    ↓                    ↓
                Store List        Store Details (hours, rating)
                    ↓
                Get Directions
```

### Key Components

#### Store Search
- **Input**: Ingredient name + user location
- **Output**: List of nearby stores
- **Data**: Google Maps/Places API
- **Filters**:
  - Distance (radius)
  - Store type (grocery, health food)
  - Rating (optional)

#### Store Information
- Name and address
- Distance from user
- Operating hours
- User ratings
- Phone number
- Website link

#### Navigation
- Link to Google Maps directions
- Store website
- Phone for quick call

### API Endpoints

```
GET    /marketplace/stores              - Search stores by ingredient/ingredient
GET    /marketplace/stores/:id/details  - Get store details
```

### Agent Involvement

**Logistics Agent**:
- Identifies missing ingredients from meal plans
- Searches for nearby stores via Google Maps
- Provides ranked list of store options
- Suggests alternatives if ingredient not available

---

## 6. Progress & Analytics

### Purpose
Track user's wellness journey with visual charts, metrics, and achievement tracking.

### User Flow

```
Progress Tab → View Dashboard → See Charts
               ↓                    ↓
           View Metrics        Filter by Date Range
               ↓                    ↓
           View Streaks        Export Data
```

### Key Components

#### Progress Metrics
- **Weight**: Track weight changes over time
- **Completion Rate**: Daily target completion percentage
- **Streak**: Consecutive days of hitting targets
- **Workout Duration**: Total exercise time
- **Calories**: Consumed vs. burned

#### Visualizations
- **Weight Chart**: Line chart over time
- **Completion Rate**: Bar chart (daily/weekly)
- **Streak Counter**: Visual streak display
- **Activity Heatmap**: Calendar view of activity

#### Achievements
- **First Workout**: Complete first workout
- **7-Day Streak**: Hit targets for 7 consecutive days
- **Recipe Master**: Try 10 different recipes
- **Weather Warrior**: Complete workout in rain (indoor alternative)

### API Endpoints

```
GET    /progress/metrics/:userId           - Get all metrics
GET    /progress/metrics/:type             - Get metrics by type
POST   /progress/metrics                   - Log metric value
GET    /progress/streaks/:userId          - Get current streaks
GET    /progress/history/:type/:startDate/:endDate - Get historical data
```

---

## 7. Conversational Agent Interface

### Purpose
Provide a natural language chat interface for users to interact with all agents seamlessly.

### User Flow

```
Chat Tab → Ask Question → Agent Routing
               ↓                 ↓
           Get Response     Context Updates
               ↓                 ↓
           Follow Up      Agent Hand-off
```

### Key Components

#### Agent Routing
- **Intent Detection**: Determines which agent should handle request
- **Context Awareness**: Uses conversation history for personalized responses
- **Hand-off**: Seamlessly transfers between agents

#### Conversation Types
- **Health Questions**: → Intake & Safety Agent
- **Recipe Requests**: → Meal Planner Agent
- **Workout Queries**: → Exercise Coach Agent
- **Ingredient Sourcing**: → Logistics Agent

#### Context Sharing
- Health profile (allergies, injuries, goals)
- Pantry state (available ingredients)
- Workout progress (current plan, soreness)
- Location (city, zip code)

### API Endpoints

```
POST   /agents/chat                          - Send message to agent
GET     /agents/conversations/:userId           - Get conversation history
DELETE  /agents/conversations/:id              - Clear conversation
POST     /agents/conversations/:id/feedback    - Provide feedback
```

### Agent Involvement

**All Agents**: Participate in conversation based on user intent

**Orchestration Layer**: Manages routing and context sharing

### Example Conversation

```
User: "I'm feeling sore after yesterday's workout"

System → Exercise Coach Agent
Agent: "I understand! What type of soreness?
       Knee, back, shoulder, or somewhere else?"

User: "My shoulders"

System → Exercise Coach Agent (checks workout history)
Agent: "I see you did a pushing-focused upper body workout.
       I'll adjust your next workout to focus on pulling movements
       to help your shoulders recover.

       Here's a modified plan for today:
       - Warm-up: 5 min arm circles
       - Main: Dumbbell rows, face pulls, rear delt flyes
       - Cool-down: Shoulder stretching

       Rest is important - take it easy today!"

User: "Thanks! What should I eat for lunch?"

System → Meal Planner Agent (checks pantry)
Agent: "Based on what you have in your fridge:
       Spinach, eggs, yogurt...

       How about a protein-packed spinach salad?
       - Mixed greens with spinach
       - Hard-boiled eggs (2)
       - Greek yogurt dressing
       - 380 calories, 28g protein"
```

---

## 8. Notifications

### Purpose
Keep users informed and motivated through timely, contextual push notifications.

### Key Components

#### Notification Types
- **Morning Workout** (7:00 AM): Today's workout or weather change
- **Meal Reminders** (optional): Meal time reminders
- **Achievements**: New badges or milestones
- **Health Alerts**: Safety concerns or plan changes
- **Weekly Summary**: Progress recap

#### Weather-Triggered Notifications
```typescript
// Morning check notification
"It's sunny in Lagos! ☀️
Perfect day for your outdoor run.
I've adjusted your workout for the nice weather."

// Rain notification
"It's raining today! 🌧️
I've swapped to an indoor HIIT session.
Your living room becomes your gym!"
```

#### Progress Notifications
```typescript
// Streak achievement
"🔥 7-Day Streak!
You've hit your targets for 7 days in a row!
Keep up the amazing work!"

// Milestone
"🎉 You've completed 50 workouts!
That's serious dedication. Your fitness level may be increasing!"
```

### API Endpoints

```
POST   /notifications/register              - Register push token
GET     /notifications/settings             - Get notification preferences
PUT     /notifications/settings             - Update preferences
POST   /notifications/send-test             - Send test notification
```

### Technology
- **Firebase Cloud Messaging (FCM)** for web push
- **Web Push API** for browser notifications
- **Background Jobs** (Cron) for scheduled notifications

---

## Feature Dependencies

### Dependency Graph

```
┌─────────────────────────────────────────────────────────────┐
│                    Onboarding                           │
│              (Health Profile Creation)                    │
└────────────────┬────────────────────────────────────────────┘
                 │
        ┌────────┴────────┬───────────────┐
        │                 │               │
   ┌────▼────┐     ┌──▼────┐    ┌──▼────┐
   │  Meals   │     │Workouts│    │Progress│
   │          │     │        │    │        │
   │Fridge →  │     │Weather→│    │Metrics │
   │Recipes   │     │Adapt   │    │        │
   │MealPlans │     │         │    │        │
   └────┬────┘     └──┬────┘    └──┬────┘
        │                │             │
        └────────┬───────┴─────────────┘
                 │
           ┌─────▼──────┐
           │ Marketplace  │
           │ (Ingredient │
           │   Sourcing) │
           └─────────────┘
```

### Core Dependencies
- **Onboarding** → All features (provides health profile)
- **Meals** → Marketplace (needs ingredient sourcing)
- **Workouts** → Notifications (weather updates)
- **Progress** → All features (tracks completions)
- **All Features** → Notifications (achievement alerts)

---

## Future Enhancements

### Planned Features
- **Social Sharing**: Share achievements with friends
- **Recipe Sharing**: Community recipe database
- **Meal Prep Planning**: Batch cooking guidance
- **Equipment Tracking**: Log available workout equipment
- **Sleep Tracking**: Integrate with sleep data for recovery
- **Water Intake**: Hydration tracking and reminders
- **Integration**: Connect with fitness trackers (Fitbit, Apple Health)

---

## Summary

NoraHealth features provide:

- **Personalized Onboarding**: Structured health profile creation with safety validation
- **Vision-Powered Nutrition**: Fridge photo analysis for personalized recipes
- **Adaptive Workouts**: Weather-responsive exercise routines
- **Smart Marketplace**: Location-based ingredient sourcing
- **Comprehensive Tracking**: Progress metrics and visualizations
- **Conversational Interface**: Natural interaction with all agents
- **Contextual Notifications**: Timely, relevant push notifications
- **Safety-First**: Health validation at every step

All features work together through the multi-agent system to provide a cohesive, personalized wellness experience.
