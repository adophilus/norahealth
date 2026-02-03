import { Effect, Layer, Schema } from 'effect'
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
            new HealthProfileRepositoryError({
              message: 'Failed to decode health profile',
              cause: error
            })
        )
      )

    return HealthProfileService.of({
      create: (healthProfile) =>
        Effect.gen(function* () {
          const now = Date.now()
          const createdHealthProfile = yield* healthProfileRepository.create({
            ...healthProfile,
            created_at: now,
            updated_at: now
          })
          return createdHealthProfile
        }).pipe(
          Effect.catchTags({
            HealthProfileRepositoryError: (error) =>
              new HealthProfileServiceError({ message: error.message })
          })
        ),

      findById: (id) =>
        healthProfileRepository.findById(id).pipe(
          Effect.catchTags({
            HealthProfileRepositoryNotFoundError: (error) =>
              new HealthProfileServiceNotFoundError({ id: error.id }),
            HealthProfileRepositoryError: (error) =>
              new HealthProfileServiceError({ message: error.message })
          })
        ),

      findByUserId: (userId) =>
        healthProfileRepository.findByUserId(userId).pipe(
          Effect.catchTags({
            HealthProfileRepositoryNotFoundError: (error) =>
              new HealthProfileServiceNotFoundError({ id: error.id }),
            HealthProfileRepositoryError: (error) =>
              new HealthProfileServiceError({ message: error.message })
          })
        ),

      update: (id, healthProfile) =>
        Effect.gen(function* () {
          const updatedHealthProfile = yield* healthProfileRepository.update(
            id,
            {
              ...healthProfile,
              updated_at: Date.now()
            }
          )
          return updatedHealthProfile
        }).pipe(
          Effect.catchTags({
            HealthProfileRepositoryNotFoundError: (error) =>
              new HealthProfileServiceNotFoundError({ id: error.id }),
            HealthProfileRepositoryError: (error) =>
              new HealthProfileServiceError({ message: error.message })
          })
        ),

      delete: (id) =>
        healthProfileRepository.delete(id).pipe(
          Effect.catchTags({
            HealthProfileRepositoryNotFoundError: (error) =>
              new HealthProfileServiceNotFoundError({ id: error.id }),
            HealthProfileRepositoryError: (error) =>
              new HealthProfileServiceError({ message: error.message })
          })
        )
    })
  })
)
