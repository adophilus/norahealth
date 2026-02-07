import Database from 'better-sqlite3'
import { Effect, Layer } from 'effect'
import { Kysely, SqliteDialect, sql } from 'kysely'
import { KyselyClient } from '@/features/database/kysely/interface'
import type { KyselyDatabaseTables } from '@/features/database/kysely/tables'
import { getKyselyPlugins } from '@/features/database/kysely/utils'

export const createTestSqliteKyselyClient = async (): Promise<
  Kysely<KyselyDatabaseTables>
> => {
  // Use in-memory database for testing
  const database = new Database(':memory:')

  const dialect = new SqliteDialect({
    database
  })

  const client = new Kysely<KyselyDatabaseTables>({
    dialect,
    plugins: getKyselyPlugins()
  })

  // Enable WAL mode for better concurrency (even though it's in-memory)
  await sql`PRAGMA journal_mode=WAL;`.execute(client)
  await sql`PRAGMA foreign_keys = ON;`.execute(client)

  return client
}

export const TestSqliteKyselyClientLive = Layer.effect(
  KyselyClient,
  Effect.gen(function* () {
    const client = yield* Effect.promise(() => createTestSqliteKyselyClient())
    return KyselyClient.of(client)
  })
)
