import type { DailyMealPlan, HealthProfile } from '@nora-health/domain'
import { Effect } from 'effect'
import { MealRepository } from '../../meal/repository'
import { DailyMealPlanRepository } from '../repository'
import {
  DailyMealPlanService,
  DailyMealPlanServiceError,
  DailyMealPlanServiceNoMealsFoundError
} from './interface'

export const DailyMealPlanServiceLive = Effect.sync(() => {
  return DailyMealPlanService.of({
    generateWeeklyPlan: (userId, healthProfile) =>
      Effect.gen(function* () {
        const dailyMealPlanRepository = yield* DailyMealPlanRepository
        const mealRepository = yield* MealRepository

        const suitableMeals = yield* mealRepository.findByGoalAndAllergens(
          healthProfile.fitness_goals,
          healthProfile.allergies
        )

        if (suitableMeals.length === 0) {
          return yield* new DailyMealPlanServiceNoMealsFoundError({})
        }

        const weekDays = generateWeekDays()
        const dailyPlans: DailyMealPlan[] = []

        for (const day of weekDays) {
          const dayMeals = selectMealsForDay(
            suitableMeals,
            healthProfile.fitness_goals
          )

          const dailyPlan = yield* dailyMealPlanRepository.create({
            user_id: userId,
            date: day.date,
            breakfast: dayMeals.breakfast?.id || null,
            lunch: dayMeals.lunch?.id || null,
            dinner: dayMeals.dinner?.id || null,
            snacks: dayMeals.snacks.map((snack) => snack.id),
            notes: generateDayNotes(day, healthProfile)
          })

          dailyPlans.push(dailyPlan)
        }

        return {
          success: true,
          dailyPlans,
          message: `Successfully created ${dailyPlans.length}-day meal plan`
        }
      }),

    getWeeklyPlan: (userId, weekStartDate) =>
      Effect.gen(function* () {
        const dailyMealPlanRepository = yield* DailyMealPlanRepository

        const endDate = new Date(weekStartDate)
        endDate.setDate(endDate.getDate() + 6)

        return yield* dailyMealPlanRepository.findByUserIdAndDateRange(
          userId,
          weekStartDate,
          endDate.toISOString().split('T')[0]
        )
      }),

    updateDayPlan: (userId, date, updates) =>
      Effect.gen(function* () {
        const dailyMealPlanRepository = yield* DailyMealPlanRepository

        const existingPlan = yield* dailyMealPlanRepository.findByUserIdAndDate(
          userId,
          date
        )

        if (existingPlan._tag === 'None') {
          return yield* new DailyMealPlanServiceError({
            message: `No daily meal plan found for user ${userId} on ${date}`
          })
        }

        return yield* dailyMealPlanRepository.update(
          existingPlan.value.id,
          updates
        )
      })
  })
})

const generateWeekDays = (): Array<{ date: string; dayOfWeek: number }> => {
  const days = []
  const today = new Date()

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    days.push({
      date: date.toISOString().split('T')[0],
      dayOfWeek: date.getDay()
    })
  }

  return days
}

const selectMealsForDay = (
  availableMeals: DailyMealPlan[],
  fitnessGoals: string[]
) => {
  const goalMatchingMeals = availableMeals.filter((meal) =>
    meal.fitness_goals.some((goal) => fitnessGoals.includes(goal))
  )

  if (goalMatchingMeals.length === 0) {
    return {
      breakfast: null,
      lunch: null,
      dinner: null,
      snacks: []
    }
  }

  return {
    breakfast: goalMatchingMeals.find(
      (meal) =>
        meal.food_classes.includes('PROTEIN') ||
        meal.food_classes.includes('CARBOHYDRATE')
    ),
    lunch: goalMatchingMeals.find(
      (meal) =>
        meal.food_classes.includes('PROTEIN') &&
        meal.food_classes.includes('VEGETABLE')
    ),
    dinner: goalMatchingMeals.find(
      (meal) =>
        meal.food_classes.includes('PROTEIN') &&
        meal.calories &&
        meal.calories > 400
    ),
    snacks: goalMatchingMeals
      .filter(
        (meal) =>
          meal.food_classes.includes('FRUIT') ||
          meal.food_classes.includes('NUT')
      )
      .slice(0, 2)
  }
}

const generateDayNotes = (
  day: { date: string; dayOfWeek: number },
  healthProfile: HealthProfile
) => {
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]

  const goalNotes: Record<string, string> = {
    WEIGHT_LOSS: 'Focus on portion control',
    MUSCLE_GAIN: 'Ensure adequate protein intake',
    ENDURANCE: 'Include complex carbohydrates',
    GENERAL_HEALTH: 'Balanced nutrition approach',
    STRENGTH: 'Prioritize protein intake',
    FLEXIBILITY: 'Include anti-inflammatory foods',
    STRESS_REDUCTION: 'Focus on balanced meals',
    SLEEP_IMPROVEMENT: 'Include tryptophan-rich foods',
    HEART_HEALTH: 'Focus on heart-healthy foods'
  }

  const primaryGoal = healthProfile.fitness_goals[0]
  const note = goalNotes[primaryGoal] || 'Enjoy your meals!'

  return `${dayNames[day.dayOfWeek]}: ${note}`
}
