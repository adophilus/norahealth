import { addDays, format, parseISO, startOfWeek } from 'date-fns'
import { Effect, Layer, Option } from 'effect'
import { WorkoutService } from '@/features/workout/service'
import type { DailyWorkoutPlan } from '@/types'
import { DailyWorkoutPlanRepository } from '../repository'
import {
  DailyWorkoutPlanServiceError,
  DailyWorkoutPlanServiceNotFoundError,
  DailyWorkoutPlanServiceValidationError
} from './error'
import { DailyWorkoutPlanService } from './interface'

export const DailyWorkoutPlanServiceLive = Layer.effect(
  DailyWorkoutPlanService,
  Effect.gen(function* () {
    const repository = yield* DailyWorkoutPlanRepository
    const workoutService = yield* WorkoutService

    const mapRepositoryError = (error: unknown) =>
      new DailyWorkoutPlanServiceError({
        message: 'Repository operation failed',
        cause: error
      })

    const handleNotFound = () =>
      Effect.fail(new DailyWorkoutPlanServiceNotFoundError({}))

    const generateDateRange = (startDate: string, days: number = 7) => {
      const start = parseISO(startDate)
      return Array.from({ length: days }, (_, i) =>
        format(addDays(start, i), 'yyyy-MM-dd')
      )
    }

    return DailyWorkoutPlanService.of({
      create: (payload) =>
        Effect.gen(function* () {
          const result = yield* repository
            .create(payload)
            .pipe(Effect.mapError(mapRepositoryError))
          return result
        }),

      findById: (id) =>
        Effect.gen(function* () {
          const result = yield* repository
            .findById(id)
            .pipe(Effect.mapError(mapRepositoryError))
          return yield* Option.match(result, {
            onSome: (plan) => Effect.succeed(plan),
            onNone: () => handleNotFound()
          })
        }),

      findByUserIdAndDate: (userId, date) =>
        Effect.gen(function* () {
          const result = yield* repository
            .findByUserIdAndDate(userId, date)
            .pipe(Effect.mapError(mapRepositoryError))
          return yield* Option.match(result, {
            onSome: (plan) => Effect.succeed(plan),
            onNone: () => handleNotFound()
          })
        }),

      findByUserIdAndDateRange: (userId, startDate, endDate) =>
        Effect.gen(function* () {
          const result = yield* repository
            .findByUserIdAndDateRange(userId, startDate, endDate)
            .pipe(Effect.mapError(mapRepositoryError))
          return result
        }),

      update: (id, payload) =>
        Effect.gen(function* () {
          const result = yield* repository
            .update(id, payload)
            .pipe(Effect.mapError(mapRepositoryError))
          return yield* Option.match(result, {
            onSome: (plan) => Effect.succeed(plan),
            onNone: () => handleNotFound()
          })
        }),

      delete: (id) =>
        Effect.gen(function* () {
          yield* repository.delete(id).pipe(Effect.mapError(mapRepositoryError))
        }),

      generateWeeklyPlan: (userId, healthProfile) =>
        Effect.gen(function* () {
          const dates = generateDateRange(startOfWeek(new Date()).toISOString())

          // Get workouts suitable for user's health profile
          const suitableWorkouts = yield* workoutService
            .getWorkoutsForUserProfile(
              healthProfile.fitness_goals,
              healthProfile.injuries,
              healthProfile.body_targets
            )
            .pipe(
              Effect.mapError(
                (error) =>
                  new DailyWorkoutPlanServiceValidationError({
                    message: 'Failed to get suitable workouts',
                    cause: error
                  })
              )
            )

          // Generate workout assignments for each day
          const workoutAssignments = dates.map((date) => ({
            date,
            // For now, assign undefined to all slots - we can enhance this later
            morning_workout_id: suitableWorkouts[0]?.id,
            afternoon_workout_id: suitableWorkouts[1]?.id,
            evening_workout_id: suitableWorkouts[2]?.id
          }))

          // Create the weekly plan
          const weeklyPlan = yield* repository
            .generateWeeklyPlan(userId, dates[0], workoutAssignments)
            .pipe(
              Effect.mapError(
                (error) =>
                  new DailyWorkoutPlanServiceValidationError({
                    message: 'Failed to generate weekly plan',
                    cause: error
                  })
              )
            )

          return weeklyPlan
        }),

      selectWorkoutsForDay: (availableWorkouts, fitnessGoals) =>
        Effect.succeed({
          morning_workout: availableWorkouts[0] || null,
          afternoon_workout: availableWorkouts[1] || null,
          evening_workout: availableWorkouts[2] || null
        })
    })
  })
)
