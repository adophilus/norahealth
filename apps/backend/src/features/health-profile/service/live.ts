import { Effect, Layer } from 'effect'
import { HealthProfileRepository } from '../repository'
import { HealthProfileService } from './interface'

export const HealthProfileServiceLive = Layer.effect(
  HealthProfileService,
  Effect.gen(function* () {
    const healthProfileRepository = yield* HealthProfileRepository

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
