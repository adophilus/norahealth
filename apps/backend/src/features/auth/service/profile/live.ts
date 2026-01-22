import { AuthProfile, AuthProfileMeta } from '@nora-health/domain'
import { Console, Effect, Layer, Option, Schema } from 'effect'
import { AuthProfileRepository } from '../../repository/profile/interface'
import {
  AuthProfileServiceAlreadyExistsError,
  AuthProfileServiceError,
  AuthProfileServiceNotFoundError
} from './error'
import { AuthProfileService } from './interface'

export const AuthProfileServiceLive = Layer.effect(
  AuthProfileService,
  Effect.gen(function* () {
    const authProfileRepository = yield* AuthProfileRepository

    const metaStringToDomain = (meta: string) =>
      Effect.try(() => JSON.parse(meta)).pipe(
        Effect.flatMap(Schema.decodeUnknown(AuthProfileMeta)),
        Effect.mapError(
          (error) =>
            new AuthProfileServiceError({
              message: `Failed to parse auth profile meta: ${error.message}`,
              cause: error
            })
        )
      )

    return AuthProfileService.of({
      create: (payload) =>
        Effect.gen(function* () {
          const existingProfiles = yield* authProfileRepository.findByUserId(
            payload.user_id
          )

          const existingProfilesDomain: AuthProfile[] = []
          for (const ap of existingProfiles) {
            existingProfilesDomain.push(
              AuthProfile.make({
                ...ap,
                meta: yield* metaStringToDomain(ap.meta)
              })
            )
          }

          const alreadyExists = existingProfilesDomain.some((ap) => {
            if (ap.meta.key === payload.meta.key) {
              if (ap.meta.key === 'EMAIL' && payload.meta.key === 'EMAIL') {
                return true
              }
              if (
                ap.meta.key === 'FARCASTER' &&
                payload.meta.key === 'FARCASTER'
              ) {
                return true
              }
            }
            return false
          })

          if (alreadyExists) {
            const key =
              payload.meta.key === 'EMAIL'
                ? payload.meta.email
                : payload.meta.key
            return yield* new AuthProfileServiceAlreadyExistsError({
              message: `AuthProfile for user ${payload.user_id} with key ${key} already exists.`
            })
          }

          const authProfile = yield* authProfileRepository.create({
            ...payload,
            meta: JSON.stringify(payload.meta)
          })

          return AuthProfile.make({
            ...authProfile,
            meta: yield* metaStringToDomain(authProfile.meta)
          })
        }).pipe(
          Effect.catchTags({
            AuthProfileRepositoryError: (error) =>
              Effect.fail(
                new AuthProfileServiceError({
                  message: `Failed to create auth profile: ${error.message}`,
                  cause: error
                })
              )
          })
        ),

      findById: (id) =>
        Effect.gen(function* () {
          const authProfile = yield* authProfileRepository.findById(id).pipe(
            Effect.flatMap(
              Option.match({
                onSome: Effect.succeed,
                onNone: () =>
                  Effect.fail(new AuthProfileServiceNotFoundError({}))
              })
            )
          )

          const meta = yield* metaStringToDomain(authProfile.meta)

          return AuthProfile.make({ ...authProfile, meta })
        }).pipe(
          Effect.catchTags({
            AuthProfileRepositoryError: (error) =>
              Effect.fail(
                new AuthProfileServiceError({
                  message: `Failed to find auth profile by ID: ${error.message}`,
                  cause: error
                })
              )
          })
        ),

      findByUserId: (user_id) =>
        Effect.gen(function* () {
          const rawAuthProfiles =
            yield* authProfileRepository.findByUserId(user_id)
          const authProfiles: AuthProfile[] = []
          for (const ap of rawAuthProfiles) {
            authProfiles.push(
              AuthProfile.make({
                ...ap,
                meta: yield* metaStringToDomain(ap.meta)
              })
            )
          }

          return authProfiles
        }).pipe(
          Effect.catchTags({
            AuthProfileRepositoryError: (error) =>
              Effect.fail(
                new AuthProfileServiceError({
                  message: `Failed to find auth profiles by user ID: ${error.message}`,
                  cause: error
                })
              )
          })
        ),

      findByFarcasterFid: (fid) =>
        Effect.gen(function* () {
          const authProfile = yield* authProfileRepository
            .findByFarcasterFid(fid)
            .pipe(
              Effect.flatMap(
                Option.match({
                  onSome: Effect.succeed,
                  onNone: () =>
                    Effect.fail(new AuthProfileServiceNotFoundError({}))
                })
              )
            )

          const meta = yield* metaStringToDomain(authProfile.meta)

          return AuthProfile.make({ ...authProfile, meta })
        }).pipe(
          Effect.catchTags({
            AuthProfileRepositoryError: (error) =>
              Effect.fail(
                new AuthProfileServiceError({
                  message: `Failed to find auth profile by Farcaster FID: ${error.message}`,
                  cause: error
                })
              )
          })
        ),

      updateById: (id, payload) =>
        Effect.gen(function* () {
          const authProfile = yield* authProfileRepository
            .updateById(id, payload)
            .pipe(
              Effect.flatMap(
                Option.match({
                  onSome: Effect.succeed,
                  onNone: () =>
                    Effect.fail(new AuthProfileServiceNotFoundError({}))
                })
              )
            )

          const meta = yield* metaStringToDomain(authProfile.meta)

          return AuthProfile.make({ ...authProfile, meta })
        }).pipe(
          Effect.catchTags({
            AuthProfileRepositoryError: (error) =>
              Effect.fail(
                new AuthProfileServiceError({
                  message: `Failed to update auth profile by ID: ${error.message}`,
                  cause: error
                })
              )
          })
        ),

      deleteById: (id) =>
        Effect.gen(function* () {
          const authProfile = yield* authProfileRepository.deleteById(id).pipe(
            Effect.flatMap(
              Option.match({
                onSome: Effect.succeed,
                onNone: () =>
                  Effect.fail(new AuthProfileServiceNotFoundError({}))
              })
            )
          )

          const meta = yield* metaStringToDomain(authProfile.meta)

          return AuthProfile.make({ ...authProfile, meta })
        }).pipe(
          Effect.catchTags({
            AuthProfileRepositoryError: (error) =>
              Effect.fail(
                new AuthProfileServiceError({
                  message: `Failed to delete auth profile by ID: ${error.message}`,
                  cause: error
                })
              )
          })
        )
    })
  })
)
