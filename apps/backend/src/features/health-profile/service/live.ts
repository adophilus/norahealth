import { Effect, Layer, Schema, Option } from 'effect'
import { HealthProfileRepository } from '../repository'
import { HealthProfileService } from './interface'
import type { HealthProfile as THealthProfile } from '@/types'
import {
  Allergen,
  FitnessGoal,
  HealthProfile,
  MedicalConditions,
  Location,
  Injury
} from '@nora-health/domain'
import {
  HealthProfileServiceError,
  HealthProfileServiceNotFoundError
} from './error'
import { getUnixTime } from 'date-fns'
import { ulid } from 'ulidx'

export const HealthProfileServiceLive = Layer.effect(
  HealthProfileService,
  Effect.gen(function* () {
    const healthProfileRepository = yield* HealthProfileRepository

    const toDomain = (row: THealthProfile.Selectable) =>
      Effect.gen(function* () {
        const medicalConditions = yield* Effect.try(() =>
          JSON.parse(row.medical_conditions)
        ).pipe(Effect.flatMap(Schema.decodeUnknown(MedicalConditions)))

        const fitnessGoals = yield* Effect.try(() =>
          JSON.parse(row.fitness_goals)
        ).pipe(Effect.flatMap(Schema.decodeUnknown(Schema.Array(FitnessGoal))))

        const allergies = yield* Effect.try(() =>
          JSON.parse(row.allergies)
        ).pipe(Effect.flatMap(Schema.decodeUnknown(Schema.Array(Allergen))))

        const location = yield* Effect.try(() => JSON.parse(row.location)).pipe(
          Effect.flatMap(Schema.decodeUnknown(Location))
        )

        const injuries = yield* Effect.try(() => JSON.parse(row.injuries)).pipe(
          Effect.flatMap(Schema.decodeUnknown(Schema.Array(Injury)))
        )

        return HealthProfile.make({
          ...row,
          medical_conditions: medicalConditions,
          fitness_goals: fitnessGoals,
          injuries,
          allergies,
          location
        })
      }).pipe(
        Effect.mapError(
          (error) =>
            new HealthProfileServiceError({
              message: 'Failed to decode health profile',
              cause: error
            })
        )
      )

    return HealthProfileService.of({
      create: (payload) =>
        healthProfileRepository
          .create({
            ...payload,
            id: ulid(),
            injuries: JSON.stringify(payload.injuries),
            medical_conditions: JSON.stringify(payload.medical_conditions),
            fitness_goals: JSON.stringify(payload.fitness_goals),
            allergies: JSON.stringify(payload.allergies),
            location: JSON.stringify(payload.location)
          })
          .pipe(
            Effect.flatMap(toDomain),
            Effect.catchTags({
              HealthProfileRepositoryError: (error) =>
                new HealthProfileServiceError({
                  message: error.message,
                  cause: error
                })
            })
          ),

      findById: (id) =>
        healthProfileRepository.findById(id).pipe(
          Effect.flatMap(
            Option.match({
              onSome: Effect.succeed,
              onNone: () =>
                Effect.fail(new HealthProfileServiceNotFoundError({}))
            })
          ),
          Effect.flatMap(toDomain),
          Effect.catchTags({
            HealthProfileRepositoryError: (error) =>
              new HealthProfileServiceError({ message: error.message })
          })
        ),

      findByUserId: (userId) =>
        healthProfileRepository.findByUserId(userId).pipe(
          Effect.flatMap(
            Option.match({
              onSome: Effect.succeed,
              onNone: () =>
                Effect.fail(new HealthProfileServiceNotFoundError({}))
            })
          ),
          Effect.flatMap(toDomain),
          Effect.catchTags({
            HealthProfileRepositoryError: (error) =>
              new HealthProfileServiceError({ message: error.message })
          })
        ),

      update: (id, payload) =>
        healthProfileRepository
          .update(id, {
            ...payload,
            injuries: payload.injuries
              ? JSON.stringify(payload.injuries)
              : undefined,
            medical_conditions: payload.medical_conditions
              ? JSON.stringify(payload.medical_conditions)
              : undefined,
            fitness_goals: payload.fitness_goals
              ? JSON.stringify(payload.fitness_goals)
              : undefined,
            allergies: payload.allergies
              ? JSON.stringify(payload.allergies)
              : undefined,
            location: payload.location
              ? JSON.stringify(payload.location)
              : undefined,
            updated_at: getUnixTime(new Date())
          })
          .pipe(
            Effect.flatMap(
              Option.match({
                onSome: Effect.succeed,
                onNone: () =>
                  Effect.fail(new HealthProfileServiceNotFoundError({}))
              })
            ),
            Effect.flatMap(toDomain),
            Effect.catchTags({
              HealthProfileRepositoryError: (error) =>
                new HealthProfileServiceError({ message: error.message })
            })
          ),

      delete: (id) =>
        healthProfileRepository.delete(id).pipe(
          Effect.flatMap(
            Option.match({
              onSome: Effect.succeed,
              onNone: () =>
                Effect.fail(new HealthProfileServiceNotFoundError({}))
            })
          ),
          Effect.flatMap(toDomain),
          Effect.catchTags({
            HealthProfileRepositoryError: (error) =>
              new HealthProfileServiceError({ message: error.message })
          })
        )
    })
  })
)
