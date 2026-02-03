import { HealthProfile } from '@nora-health/domain'
import { Effect, Layer, Schema } from 'effect'
import { ulid } from 'ulidx'
import { KyselyClient } from '@/features/database/kysely'
import {
  HealthProfileRepository,
  HealthProfileRepositoryError,
  HealthProfileRepositoryNotFoundError
} from './interface'

export const KyselyHealthProfileRepositoryLive = Layer.effect(
  HealthProfileRepository,
  Effect.gen(function* () {
    const db = yield* KyselyClient

    const parseHealthProfile = (row: any): HealthProfile => {
      return HealthProfile.make({
        id: row.id,
        user_id: row.user_id,
        name: row.name,
        email: row.email,
        age_group: row.age_group,
        gender: row.gender,
        weight_class: row.weight_class,
        injuries: JSON.parse(row.injuries),
        medical_conditions: JSON.parse(row.medical_conditions),
        fitness_goals: JSON.parse(row.fitness_goals),
        weekly_workout_time: row.weekly_workout_time,
        allergies: JSON.parse(row.allergies),
        location: JSON.parse(row.location),
        onboarding_completed: row.onboarding_completed,
        onboarding_completed_at: row.onboarding_completed_at,
        created_at: row.created_at,
        updated_at: row.updated_at
      })
    }

    return HealthProfileRepository.of({
      create: (healthProfile) =>
        Effect.tryPromise({
          try: () =>
            db
              .insertInto('health_profiles')
              .values({
                user_id: healthProfile.user_id,
                name: healthProfile.name,
                email: healthProfile.email,
                age_group: healthProfile.age_group,
                gender: healthProfile.gender,
                weight_class: healthProfile.weight_class,
                injuries: JSON.stringify(healthProfile.injuries),
                medical_conditions: JSON.stringify(
                  healthProfile.medical_conditions
                ),
                fitness_goals: JSON.stringify(healthProfile.fitness_goals),
                weekly_workout_time: healthProfile.weekly_workout_time,
                allergies: JSON.stringify(healthProfile.allergies),
                location: JSON.stringify(healthProfile.location),
                onboarding_completed: healthProfile.onboarding_completed,
                onboarding_completed_at: healthProfile.onboarding_completed_at
              })
              .returning([
                'id',
                'user_id',
                'name',
                'email',
                'age_group',
                'gender',
                'weight_class',
                'injuries',
                'medical_conditions',
                'fitness_goals',
                'weekly_workout_time',
                'allergies',
                'location',
                'onboarding_completed',
                'onboarding_completed_at',
                'created_at',
                'updated_at'
              ])
              .executeTakeFirstOrThrow()
              .then(parseHealthProfile),
          catch: (error) =>
            new HealthProfileRepositoryError({
              message: `Failed to create health profile: ${error instanceof Error ? error.message : String(error)}`
            })
        }),

      findById: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('health_profiles')
              .selectAll()
              .where('id', '=', id)
              .executeTakeFirst(),
          catch: (error) =>
            new HealthProfileRepositoryError({
              message: `Failed to find health profile by id: ${error instanceof Error ? error.message : String(error)}`
            })
        }).pipe(
          Effect.flatMap((healthProfile) =>
            healthProfile
              ? Effect.succeed(parseHealthProfile(healthProfile))
              : Effect.fail(new HealthProfileRepositoryNotFoundError({ id }))
          )
        ),

      findByUserId: (userId) =>
        Effect.tryPromise({
          try: () =>
            db
              .selectFrom('health_profiles')
              .selectAll()
              .where('user_id', '=', userId)
              .executeTakeFirst(),
          catch: (error) =>
            new HealthProfileRepositoryError({
              message: `Failed to find health profile by user id: ${error instanceof Error ? error.message : String(error)}`
            })
        }).pipe(
          Effect.flatMap((healthProfile) =>
            healthProfile
              ? Effect.succeed(parseHealthProfile(healthProfile))
              : Effect.fail(
                  new HealthProfileRepositoryNotFoundError({ id: userId })
                )
          )
        ),

      update: (id, healthProfile) =>
        Effect.tryPromise({
          try: () =>
            db
              .updateTable('health_profiles')
              .set({
                ...(healthProfile.user_id !== undefined && {
                  user_id: healthProfile.user_id
                }),
                ...(healthProfile.name !== undefined && {
                  name: healthProfile.name
                }),
                ...(healthProfile.email !== undefined && {
                  email: healthProfile.email
                }),
                ...(healthProfile.age_group !== undefined && {
                  age_group: healthProfile.age_group
                }),
                ...(healthProfile.gender !== undefined && {
                  gender: healthProfile.gender
                }),
                ...(healthProfile.weight_class !== undefined && {
                  weight_class: healthProfile.weight_class
                }),
                ...(healthProfile.injuries !== undefined && {
                  injuries: JSON.stringify(healthProfile.injuries)
                }),
                ...(healthProfile.medical_conditions !== undefined && {
                  medical_conditions: JSON.stringify(
                    healthProfile.medical_conditions
                  )
                }),
                ...(healthProfile.fitness_goals !== undefined && {
                  fitness_goals: JSON.stringify(healthProfile.fitness_goals)
                }),
                ...(healthProfile.weekly_workout_time !== undefined && {
                  weekly_workout_time: healthProfile.weekly_workout_time
                }),
                ...(healthProfile.allergies !== undefined && {
                  allergies: JSON.stringify(healthProfile.allergies)
                }),
                ...(healthProfile.location !== undefined && {
                  location: JSON.stringify(healthProfile.location)
                }),
                ...(healthProfile.onboarding_completed !== undefined && {
                  onboarding_completed: healthProfile.onboarding_completed
                }),
                ...(healthProfile.onboarding_completed_at !== undefined && {
                  onboarding_completed_at: healthProfile.onboarding_completed_at
                }),
                updated_at: Date.now()
              })
              .where('id', '=', id)
              .returning([
                'id',
                'user_id',
                'name',
                'email',
                'age_group',
                'gender',
                'weight_class',
                'injuries',
                'medical_conditions',
                'fitness_goals',
                'weekly_workout_time',
                'allergies',
                'location',
                'onboarding_completed',
                'onboarding_completed_at',
                'created_at',
                'updated_at'
              ])
              .executeTakeFirstOrThrow()
              .then(parseHealthProfile),
          catch: (error) =>
            new HealthProfileRepositoryError({
              message: `Failed to update health profile: ${error instanceof Error ? error.message : String(error)}`
            })
        }),

      delete: (id) =>
        Effect.tryPromise({
          try: () =>
            db
              .deleteFrom('health_profiles')
              .where('id', '=', id)
              .executeTakeFirstOrThrow(),
          catch: (error) =>
            new HealthProfileRepositoryError({
              message: `Failed to delete health profile: ${error instanceof Error ? error.message : String(error)}`
            })
        })
    })
  })
)
