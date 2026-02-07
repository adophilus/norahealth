import {
  DailyMealPlan,
  type FitnessGoal,
  type HealthProfile,
  type Meal
} from '@nora-health/domain'
import { getUnixTime } from 'date-fns'
import { Effect, Layer, Option, Schema } from 'effect'
import { ulid } from 'ulidx'
import { DailyMealPlanRepository } from '../repository'
import {
  DailyMealPlanServiceError,
  DailyMealPlanServiceNoMealsFoundError
} from './error'
import { DailyMealPlanService } from './interface'
import type { DailyMealPlan as TDailyMealPlan } from '@/types'
import { MealService } from '@/features/meal'

export const DailyMealPlanServiceLive = Layer.effect(
  DailyMealPlanService,
  Effect.gen(function* () {
    const dailyMealPlanRepository = yield* DailyMealPlanRepository
    const mealService = yield* MealService

    const toDomain = (row: TDailyMealPlan.Selectable) =>
      Effect.gen(function* () {
        const snacks = yield* Effect.try(() =>
          JSON.parse(row.snacks || '[]')
        ).pipe(
          Effect.flatMap(Schema.decodeUnknown(Schema.Array(Schema.String)))
        )

        return DailyMealPlan.make({
          ...row,
          snacks
        })
      }).pipe(
        Effect.mapError(
          (error) =>
            new DailyMealPlanServiceError({
              message: 'Failed to decode daily meal plan',
              cause: error
            })
        )
      )

    return DailyMealPlanService.of({
      generateWeeklyPlan: (userId, healthProfile) =>
        Effect.gen(function* () {
          const suitableMeals = yield* mealService
            .findByGoalAndAllergens(
              [...healthProfile.fitness_goals],
              [...healthProfile.allergies]
            )
            .pipe(
              Effect.catchTags({
                MealServiceError: (error) =>
                  new DailyMealPlanServiceError({
                    message: 'Failed to find suitable meals',
                    cause: error
                  })
              })
            )

          if (suitableMeals.length === 0) {
            return yield* Effect.fail(
              new DailyMealPlanServiceNoMealsFoundError({})
            )
          }

          const weekDays = generateWeekDays()
          const dailyPlans: DailyMealPlan[] = []

          for (const day of weekDays) {
            const dayMeals = selectMealsForDay(suitableMeals, [
              ...healthProfile.fitness_goals
            ])

            const dbRecord = yield* dailyMealPlanRepository
              .create({
                id: ulid(),
                user_id: userId,
                date: day.date,
                breakfast: dayMeals.breakfast?.id ?? null,
                lunch: dayMeals.lunch?.id ?? null,
                dinner: dayMeals.dinner?.id ?? null,
                snacks: JSON.stringify(
                  dayMeals.snacks.map((snack) => snack.id)
                ),
                notes: generateDayNotes(healthProfile)
              })
              .pipe(
                Effect.catchTags({
                  DailyMealPlanRepositoryError: (error) =>
                    new DailyMealPlanServiceError({
                      message: `Failed to create daily meal plan for ${day.date}`,
                      cause: error
                    })
                })
              )

            // Transform database record to domain object using toDomain
            const domainObject = yield* toDomain(dbRecord)
            dailyPlans.push(domainObject)
          }

          return dailyPlans
        }),

      getWeeklyPlan: (userId, weekStartDate) =>
        Effect.gen(function* () {
          const endDate = new Date(weekStartDate)
          endDate.setDate(endDate.getDate() + 6)

          const dbRecords = yield* dailyMealPlanRepository
            .findByUserIdAndDateRange(
              userId,
              weekStartDate,
              endDate.toISOString().split('T')[0]
            )
            .pipe(
              Effect.catchTags({
                DailyMealPlanRepositoryError: (error) =>
                  new DailyMealPlanServiceError({
                    message: `Failed to get weekly plan for user ${userId}`,
                    cause: error
                  })
              })
            )

          // Transform database records to domain objects using toDomain
          const domainObjects = yield* Effect.all(
            dbRecords.map((record) => toDomain(record))
          )

          return domainObjects
        }),

      updateDayPlan: (userId, date, updates) =>
        Effect.gen(function* () {
          const existingPlan =
            yield* dailyMealPlanRepository.findByUserIdAndDate(userId, date)

          const plan = yield* Option.match(existingPlan, {
            onSome: (plan) => Effect.succeed(plan),
            onNone: () =>
              Effect.fail(
                new DailyMealPlanServiceError({
                  message: `No daily meal plan found for user ${userId} on ${date}`
                })
              )
          })

          // Transform domain updates to database updates
          const dbUpdates = {
            breakfast: updates.breakfast,
            lunch: updates.lunch,
            dinner: updates.dinner,
            snacks: JSON.stringify(updates.snacks),
            notes: updates.notes,
            updated_at: getUnixTime(new Date())
          }

          const updatedDbRecord = yield* dailyMealPlanRepository
            .updateById(plan.id, dbUpdates)
            .pipe(
              Effect.flatMap(
                Option.match({
                  onSome: (record) => Effect.succeed(record),
                  onNone: () =>
                    Effect.fail(
                      new DailyMealPlanServiceError({
                        message: `Failed to update daily meal plan for ${date}`
                      })
                    )
                })
              ),
              Effect.catchTags({
                DailyMealPlanRepositoryError: (error) =>
                  new DailyMealPlanServiceError({
                    message: `Failed to update daily meal plan for ${date}`,
                    cause: error
                  })
              })
            )

          // Transform database record back to domain object using toDomain
          return yield* toDomain(updatedDbRecord)
        }).pipe(
          Effect.mapError((error) =>
            error instanceof DailyMealPlanServiceError
              ? error
              : new DailyMealPlanServiceError({
                  message: 'Failed to update day plan',
                  cause: error
                })
          )
        )
    })
  })
)

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
  availableMeals: Meal[],
  fitnessGoals: FitnessGoal[]
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

const generateDayNotes = (healthProfile: HealthProfile) => {
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

  return note
}
