import createClient from 'openapi-fetch'
import createReactQueryClient from 'openapi-react-query'
import { HttpApiClient, HttpClient, HttpClientRequest } from '@effect/platform'
import { Option } from 'effect'
import { Api } from '@nora-health/api'
import type { paths } from '../build/types'

export const createFetchClient = (baseUrl: string) =>
  createClient<paths>({
    baseUrl
  })

type FetchClient = ReturnType<typeof createFetchClient>

export const createTanstackQueryClient = (client: FetchClient) =>
  createReactQueryClient(client)

export type MakeApiClientArgs = Partial<{
  accessToken: string
  baseUrl: string
}>

export const makeApiClient = ({ accessToken, baseUrl }: MakeApiClientArgs) =>
  HttpApiClient.make(Api, {
    baseUrl,
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
