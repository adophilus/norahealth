import { Effect, Schedule, Console, Layer } from 'effect'
import { AuthTokenService } from './service/token/interface' // Added
import { AuthSessionService } from './service' // Import AuthSessionService

export const cleanExpiredAuthTokens = Effect.gen(function*() {
  const authTokenService = yield* AuthTokenService // Added
  yield* Console.log('Running cron job: Cleaning expired auth tokens...')

  yield* authTokenService.deleteExpired().pipe(
    Effect.tap(() => Console.log('Expired auth tokens cleaned successfully.')),
    Effect.catchAll((error) =>
      Console.error(`Error cleaning expired auth tokens: ${error.message}`)
    )
  )
}).pipe(Effect.repeat(Schedule.fixed('1 minutes')))

export const cleanExpiredAuthSessions = Effect.gen(function*() {
  const authSessionService = yield* AuthSessionService
  yield* Console.log('Running cron job: Cleaning expired auth sessions...')

  yield* authSessionService.deleteAllExpired().pipe(
    Effect.tap(() =>
      Console.log('Expired auth sessions cleaned successfully.')
    ),
    Effect.catchAll((error) =>
      Console.error(`Error cleaning expired auth sessions: ${error.message}`)
    )
  )
}).pipe(Effect.repeat(Schedule.fixed('1 minutes')))

export const AuthCronJob = Layer.effectDiscard(
  Effect.void
  // Effect.all([cleanExpiredAuthTokens, cleanExpiredAuthSessions], {
  //   concurrency: 'unbounded'
  // })
  // Effect.fork
)
