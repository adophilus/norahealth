import {
  ApiLive,
  DatabaseLayer,
  StorageDepLayer,
  UserDepLayer,
  HealthProfileDepLayer,
  DailyMealPlanDepLayer,
  DailyWorkoutPlanDepLayer
} from '@/bootstrap'
import {
  AuthSessionServiceLive,
  KyselyAuthSessionRepositoryLive,
  KyselyAuthTokenRepositoryLive
} from '@/features/auth'
import { DefaultAuthTokenServiceLive } from '@/features/auth/service/token/default'
import { AppConfigLive, EnvLive } from '@/features/config'
import { KyselyClient } from '@/features/database/kysely'
import { MockMailerLive } from '@/features/mailer'
import {
  HttpApiBuilder,
  HttpApiClient,
  HttpClient,
  HttpClientRequest
} from '@effect/platform'
import { NodeHttpServer } from '@effect/platform-node'
import { Api } from '@nora-health/api'
import { Layer, Option, Effect } from 'effect'

export const makeApiClient = (accessToken?: string) =>
  HttpApiClient.make(Api, {
    transformClient: (client) =>
      client.pipe(
        HttpClient.mapRequest((request) =>
          Option.fromNullable(accessToken).pipe(
            Option.map((accessToken) =>
              request.pipe(HttpClientRequest.bearerToken(accessToken))
            ),
            Option.getOrElse(() => request)
          )
        )
      )
  })

export type ApiClient = ReturnType<typeof makeApiClient>

const AuthDepLayer = Layer.empty.pipe(
  Layer.provideMerge(AuthSessionServiceLive),
  Layer.provideMerge(DefaultAuthTokenServiceLive),
  Layer.provideMerge(KyselyAuthTokenRepositoryLive),
  Layer.provideMerge(KyselyAuthSessionRepositoryLive)
)

const DatabaseTransactionLayer = Layer.effect(
  KyselyClient,
  Effect.gen(function* () {
    const db = yield* KyselyClient

    const tx = yield* Effect.tryPromise(() => db.startTransaction().execute())

    return KyselyClient.of(tx)
  })
).pipe(Layer.provide(DatabaseLayer))

const DepLayer = Layer.empty.pipe(
  Layer.provideMerge(AuthDepLayer),
  Layer.provideMerge(UserDepLayer),
  Layer.provideMerge(HealthProfileDepLayer),
  Layer.provideMerge(DailyMealPlanDepLayer),
  Layer.provideMerge(DailyWorkoutPlanDepLayer),
  // Layer.provideMerge(LLMDepLayer),
  Layer.provideMerge(StorageDepLayer),
  Layer.provideMerge(MockMailerLive),
  Layer.provideMerge(DatabaseTransactionLayer)
)

export const ServerLive = HttpApiBuilder.serve().pipe(
  Layer.provideMerge(ApiLive),
  Layer.provideMerge(DepLayer),
  Layer.provide(AppConfigLive),
  Layer.provide(EnvLive),
  Layer.provideMerge(NodeHttpServer.layerTest)
)
