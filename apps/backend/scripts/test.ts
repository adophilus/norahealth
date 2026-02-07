import { Effect, Layer, Console } from 'effect'
import { DepLayer, LoggerLive } from '@/bootstrap'
import { AppConfigLive, EnvLive } from '@/features/config'
import { User } from '@nora-health/domain'

const layer = DepLayer.pipe(
  Layer.provide(LoggerLive),
  Layer.provide(AppConfigLive),
  Layer.provide(EnvLive)
)

Console.log(
  User.make({
    id: '01KGWMVG95SDJG8Z8S9E4CSXG9',
    display_name: null,
    email: 'Keshawn.Nicolas15@gmail.com',
    status: 'NOT_VERIFIED',
    role: 'USER',
    profile_picture_id: null,
    verified_at: null,
    created_at: 1770487922,
    updated_at: null,
    deleted_at: null
  })
).pipe(Effect.provide(layer), Effect.runPromise)
