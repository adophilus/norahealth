import { Kysely } from 'kysely'
import { PostgresJSDialect } from 'kysely-postgres-js'
import postgres from 'postgres'
import type { KyselyDatabaseTables } from '../tables'
import { getKyselyPlugins } from '../utils'
import { KyselyClient } from '../interface'
import { Effect, Layer } from 'effect'
import { AppConfig } from '@/features/config'

// PostgreSQL OID for timestamp without time zone
const TIMESTAMP_WITHOUT_TIME_ZONE_OID = 1114

export const getCreateRawPgKyselyClientOptions = (url: string) => {
  const dialect = new PostgresJSDialect({
    postgres: postgres(url, {
      types: {
        1114: { // Keyed by OID directly
          from: [TIMESTAMP_WITHOUT_TIME_ZONE_OID], // Specify OID for parsing from DB
          to: TIMESTAMP_WITHOUT_TIME_ZONE_OID, // Specify OID for serializing to DB
          serialize: (val: number) => {
            // Convert epoch to Date for DB insertion
            return new Date(val * 1000)
          },
          parse: (val: string) => {
            // Convert string timestamp from DB to epoch number
            return new Date(val).getTime() / 1000
          }
        }
      }
    })
  })
  return { dialect, plugins: getKyselyPlugins() }
}

export const createRawPgKyselyClient = async (
  url: string
): Promise<Kysely<KyselyDatabaseTables>> =>
  new Kysely(getCreateRawPgKyselyClientOptions(url))

export const PgKyselyClientLive = Layer.effect(
  KyselyClient,
  Effect.gen(function* () {
    const config = yield* AppConfig
    const client = yield* Effect.promise(() =>
      createRawPgKyselyClient(config.db.url)
    )
    return KyselyClient.of(client)
  })
)
