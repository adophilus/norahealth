import { Effect, Layer, Console } from 'effect'
import { DepLayer, LoggerLive } from '@/bootstrap'
import { AuthProfileService } from '@/features/auth'
import { AppConfigLive, EnvLive } from '@/features/config'

const layer = DepLayer.pipe(
  Layer.provide(LoggerLive),
  Layer.provide(AppConfigLive),
  Layer.provide(EnvLive)
)

// @effect-diagnostics-next-line floatingEffect:off
Effect.gen(function* () {
  const authProfileService = yield* AuthProfileService

  yield* authProfileService
    .findByFarcasterFid('2064635')
    .pipe(Effect.tap(Console.log))
  // console.log({ res })
}).pipe(Effect.provide(layer), Effect.runPromise)
