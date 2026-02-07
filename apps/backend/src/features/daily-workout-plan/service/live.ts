import { addDays, format, parseISO, startOfWeek } from 'date-fns'
import { Effect, Layer, Option } from 'effect'
import { ulid } from 'ulidx'
import { WorkoutService } from '@/features/workout/service'
import type { DailyWorkoutPlan } from '@/types'
import { DailyWorkoutPlanRepository } from '../repository/interface'
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

    const asRepositoryError = <A>(
      effect: Effect.Effect<A, unknown>
    ): Effect.Effect<A, DailyWorkoutPlanServiceError> =>
      effect.pipe(Effect.mapError(mapRepositoryError))

    const asRepositoryErrorWithNotFound = <A>(
      effect: Effect.Effect<A, unknown>
    ): Effect.Effect<
      A,
      DailyWorkoutPlanServiceError | DailyWorkoutPlanServiceNotFoundError
    > => effect.pipe(Effect.mapError(mapRepositoryError))

    const handleNotFound = () =>
      Effect.fail(new DailyWorkoutPlanServiceNotFoundError({}))

    const generateDateRange = (startDate: string, days: number = 7) => {
      const start = parseISO(startDate)
      return Array.from({ length: days }, (_, i) =>
        format(addDays(start, i), 'yyyy-MM-dd')
      )
    }

    return DailyWorkoutPlanService.of({
      create: (payload) => asRepositoryError(repository.create(payload)),

      findById: (id) =>
        Effect.gen(function* () {
          const result = yield* asRepositoryErrorWithNotFound(
            repository.findById(id)
          )
          return yield* Option.match(result, {
            onSome: (plan) => Effect.succeed(plan),
            onNone: () => handleNotFound()
          })
        }),

      findByUserIdAndDate: (userId, date) =>
        Effect.gen(function* () {
          const result = yield* asRepositoryErrorWithNotFound(
            repository.findByUserIdAndDate(userId, date)
          )
          return yield* Option.match(result, {
            onSome: (plan) => Effect.succeed(plan),
            onNone: () => handleNotFound()
          })
        }),

      findByUserIdAndDateRange: (userId, startDate, endDate) =>
        asRepositoryError(
          repository.findByUserIdAndDateRange(userId, startDate, endDate)
        ),

      update: (id, payload) =>
        Effect.gen(function* () {
          const result = yield* asRepositoryErrorWithNotFound(
            repository.update(id, payload)
          )
          return yield* Option.match(result, {
            onSome: (plan) => Effect.succeed(plan),
            onNone: () => handleNotFound()
          })
        }),

      delete: (id) => asRepositoryErrorWithNotFound(repository.delete(id)),

      generateWeeklyPlan: (userId, healthProfile) =>
        Effect.gen(function* () {
          const dates = generateDateRange(startOfWeek(new Date()).toISOString())

          // Get suitable workouts for user's health profile
          const suitableWorkouts = yield* workoutService
            .getWorkoutsForUserProfile(
              [...healthProfile.fitness_goals],
              [...healthProfile.injuries],
              [...healthProfile.body_targets]
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
            .pipe(
              Effect.mapError(
                (error) =>
                  new DailyWorkoutPlanServiceValidationError({
                    message: 'Failed to get suitable workouts',
                    cause: error
                  })
              )
            )

          // Create daily workout plans for each day
          const weeklyPlan: DailyWorkoutPlan.Selectable[] = []
          for (const date of dates) {
            // Select workouts for this day (simple rotation for now)
            const dayWorkouts = suitableWorkouts.slice(0, 3) // Take first 3 workouts

            const dailyPlan = yield* repository
              .create({
                id: ulid(),
                user_id: userId,
                date,
                notes: ''
              })
              .pipe(Effect.mapError(mapRepositoryError))

            weeklyPlan.push(dailyPlan)
          }

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
