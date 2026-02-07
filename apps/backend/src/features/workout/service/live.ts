import { BodyTarget, FitnessGoal, Injury, Workout } from '@nora-health/domain'
import { Effect, Layer, Option, Schema } from 'effect'
import { ulid } from 'ulidx'
import type { Workout as TWorkout } from '@/types'
import { WorkoutRepository } from '../repository'
import { WorkoutServiceError, WorkoutServiceNotFoundError } from './error'
import { WorkoutService } from './interface'

export const WorkoutServiceLive = Layer.effect(
  WorkoutService,
  Effect.gen(function* () {
    const repository = yield* WorkoutRepository

    const toDomain = (row: TWorkout.Selectable) =>
      Effect.try({
        try: () => {
          const bodyTargets = JSON.parse(row.body_targets)
          const contraindications = JSON.parse(row.contraindications)
          const fitnessGoals = JSON.parse(row.fitness_goals)

          return Workout.make({
            ...row,
            body_targets: Schema.decodeUnknownSync(Schema.Array(BodyTarget))(
              bodyTargets
            ),
            contraindications: Schema.decodeUnknownSync(Schema.Array(Injury))(
              contraindications
            ),
            fitness_goals: Schema.decodeUnknownSync(Schema.Array(FitnessGoal))(
              fitnessGoals
            )
          })
        },
        catch: (error) =>
          new WorkoutServiceError({
            message: 'Failed to decode workout',
            cause: error
          })
      })

    const toDomainArray = (rows: TWorkout.Selectable[]) =>
      Effect.all(rows.map(toDomain))

    const serializeComplexFields = (payload: any) => {
      const result: any = {}

      if (payload.body_targets) {
        result.body_targets = JSON.stringify(payload.body_targets)
      }
      if (payload.contraindications) {
        result.contraindications = JSON.stringify(payload.contraindications)
      }
      if (payload.fitness_goals) {
        result.fitness_goals = JSON.stringify(payload.fitness_goals)
      }

      return result
    }

    const mapRepositoryError = (error: unknown) =>
      new WorkoutServiceError({
        message: 'Repository operation failed',
        cause: error
      })

    const handleNotFound = () =>
      Effect.fail(new WorkoutServiceNotFoundError({}))

    return WorkoutService.of({
      create: (payload) =>
        Effect.gen(function* () {
          const workoutData = {
            id: ulid(),
            ...payload,
            ...serializeComplexFields(payload),
            created_at: Date.now()
          }

          const row = yield* repository
            .create(workoutData)
            .pipe(Effect.mapError(mapRepositoryError))
          return yield* toDomain(row)
        }),

      findById: (id) =>
        Effect.gen(function* () {
          const result = yield* repository
            .findById(id)
            .pipe(Effect.mapError(mapRepositoryError))
          return yield* Option.match(result, {
            onSome: (row) => toDomain(row),
            onNone: handleNotFound
          })
        }),

      findAll: () =>
        Effect.gen(function* () {
          const rows = yield* repository
            .findAll()
            .pipe(Effect.mapError(mapRepositoryError))
          return yield* toDomainArray(rows)
        }),

      update: (id, payload) =>
        Effect.gen(function* () {
          const existing = yield* repository
            .findById(id)
            .pipe(Effect.mapError(mapRepositoryError))

          if (Option.isNone(existing)) {
            return yield* handleNotFound()
          }

          const updateData = {
            ...payload,
            ...serializeComplexFields(payload),
            updated_at: Date.now()
          }

          const result = yield* repository
            .update(id, updateData)
            .pipe(Effect.mapError(mapRepositoryError))
          return yield* Option.match(result, {
            onSome: (row) => toDomain(row),
            onNone: handleNotFound
          })
        }),

      delete: (id) =>
        Effect.gen(function* () {
          const existing = yield* repository
            .findById(id)
            .pipe(Effect.mapError(mapRepositoryError))

          if (Option.isNone(existing)) {
            return yield* handleNotFound()
          }

          yield* repository.delete(id).pipe(Effect.mapError(mapRepositoryError))
        }),

      findByFitnessGoals: (goals) =>
        Effect.gen(function* () {
          const rows = yield* repository
            .findByFitnessGoals(goals)
            .pipe(Effect.mapError(mapRepositoryError))
          return yield* toDomainArray(rows)
        }),

      findByBodyTargets: (targets) =>
        Effect.gen(function* () {
          const rows = yield* repository
            .findByBodyTargets(targets)
            .pipe(Effect.mapError(mapRepositoryError))
          return yield* toDomainArray(rows)
        }),

      findByInjuriesExcluded: (excludedInjuries) =>
        Effect.gen(function* () {
          const rows = yield* repository
            .findByInjuriesExcluded(excludedInjuries)
            .pipe(Effect.mapError(mapRepositoryError))
          return yield* toDomainArray(rows)
        }),

      findByGoalAndBodyTargets: (goals, targets) =>
        Effect.gen(function* () {
          const rows = yield* repository
            .findByGoalAndBodyTargets(goals, targets)
            .pipe(Effect.mapError(mapRepositoryError))
          return yield* toDomainArray(rows)
        }),

      getWorkoutsForUserProfile: (fitnessGoals, injuries, bodyTargets) =>
        Effect.gen(function* () {
          const goalTargetWorkouts = yield* repository
            .findByGoalAndBodyTargets(fitnessGoals, bodyTargets)
            .pipe(Effect.mapError(mapRepositoryError))
          const injurySafeWorkouts = yield* repository
            .findByInjuriesExcluded(injuries)
            .pipe(Effect.mapError(mapRepositoryError))

          const allWorkouts = [...goalTargetWorkouts, ...injurySafeWorkouts]
          const uniqueWorkouts = allWorkouts.filter(
            (workout, index, self) =>
              index === self.findIndex((w) => w.id === workout.id)
          )

          return yield* toDomainArray(uniqueWorkouts)
        })
    })
  })
)
