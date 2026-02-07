import { ApiLive, DatabaseLayer } from '@/bootstrap'
import { KyselyAuthTokenRepositoryLive } from '@/features/auth'
import { DefaultAuthTokenServiceLive } from '@/features/auth/service/token/default'
import { AppConfigLive, EnvLive } from '@/features/config'
import { MockMailerLive } from '@/features/mailer'
import {
  HttpApiBuilder,
  HttpApiClient,
  HttpClient,
  HttpClientRequest
} from '@effect/platform'
import { NodeHttpServer } from '@effect/platform-node'
import { Api } from '@nora-health/api'
import { Layer, Option } from 'effect'

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

export const ServerLive = HttpApiBuilder.serve().pipe(
  Layer.provideMerge(ApiLive),
  Layer.provideMerge(DefaultAuthTokenServiceLive),
  Layer.provideMerge(KyselyAuthTokenRepositoryLive),
  Layer.provideMerge(DatabaseLayer),
  Layer.provideMerge(MockMailerLive),
  Layer.provide(AppConfigLive),
  Layer.provide(EnvLive),
  Layer.provideMerge(NodeHttpServer.layerTest)
)
