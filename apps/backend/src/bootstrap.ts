import { createServer } from 'node:http'
import { DevTools } from '@effect/experimental'
import {
  HttpApiBuilder,
  HttpMiddleware,
  HttpServer,
  NodeHttpServer
} from '@effect/platform-node'
import { Api } from '@nora-health/api'
import { Console, Data, Effect, Layer, Logger } from 'effect'
import type { MigrationResultSet } from 'kysely'
import {
  AuthApiLive,
  AuthenticationMiddlewareLive,
  AuthSessionServiceLive,
  EmailAuthTokenServiceLive,
  KyselyAuthSessionRepositoryLive,
  KyselyAuthTokenRepositoryLive
} from './features/auth'
import { AppConfig } from './features/config'
import { KyselyClient } from './features/database/kysely'
import { SqliteKyselyClientLive } from './features/database/kysely/db/sqlite'
import { createKyselyMigrator } from './features/database/kysely/migrator'
import {
  HealthProfileServiceLive,
  KyselyHealthProfileRepositoryLive
} from './features/health-profile'
import {
  KyselyAgentConversationRepositoryLive,
  LLMServiceLive
} from './features/llm'
import { AgentApiLive } from './features/llm/AgentApiLive'
import { NodemailerMailerLive } from './features/mailer/service/nodemailer'
import {
  MealRepository,
  KyselyMealRepositoryLive
} from './features/meal/repository'
import {
  KyselyStorageRepositoryLive,
  StorageApiLive,
  StorageServiceLive
} from './features/storage'
import {
  KyselyUserRepositoryLive,
  UserApiLive,
  UserServiceLive
} from './features/user'
import {
  DailyMealPlanApiLive,
  DailyMealPlanServiceLive,
  KyselyDailyMealPlanRepositoryLive
} from './features/daily-meal-plan'
import { MealServiceLive } from './features/meal'

export class DatabaseMigrationFailedError extends Data.TaggedError(
  'DatabaseMigrationFailedError'
)<{ cause: unknown }> {}

export const DatabaseClientLayer = SqliteKyselyClientLive

const checkMigrationResultSet = (rs: MigrationResultSet) =>
  rs.error ? Effect.fail(rs.error) : Effect.void

export const DatabaseMigrationLayer = Layer.effectDiscard(
  Effect.gen(function* () {
    const client = yield* KyselyClient
    const config = yield* AppConfig

    const migrator = createKyselyMigrator(client, config.db.migrationsFolder)

    yield* Effect.tryPromise({
      try: () => migrator.migrateToLatest(),
      catch: (err) => new DatabaseMigrationFailedError({ cause: err })
    }).pipe(Effect.flatMap(checkMigrationResultSet))
    yield* Console.log('Ran all migrations')
  })
)

export const DatabaseLayer = DatabaseMigrationLayer.pipe(
  Layer.provideMerge(DatabaseClientLayer)
)

export const MailerLayer = NodemailerMailerLive

export const StorageDepLayer = StorageServiceLive.pipe(
  Layer.provideMerge(KyselyStorageRepositoryLive)
)

export const UserDepLayer = UserServiceLive.pipe(
  Layer.provideMerge(KyselyUserRepositoryLive),
  Layer.provideMerge(KyselyStorageRepositoryLive)
)

export const HealthProfileDepLayer = HealthProfileServiceLive.pipe(
  Layer.provideMerge(KyselyHealthProfileRepositoryLive)
)

export const DailyMealPlanDepLayer = Layer.empty.pipe(
  Layer.provideMerge(DailyMealPlanServiceLive),
  Layer.provideMerge(MealServiceLive),
  Layer.provideMerge(KyselyDailyMealPlanRepositoryLive),
  Layer.provideMerge(KyselyMealRepositoryLive)
)

export const LLMDepLayer = Layer.empty.pipe(
  Layer.provideMerge(LLMServiceLive),
  Layer.provideMerge(KyselyAgentConversationRepositoryLive)
)

export const AuthDepLayer = Layer.empty.pipe(
  Layer.provideMerge(AuthSessionServiceLive),
  Layer.provideMerge(EmailAuthTokenServiceLive),
  Layer.provideMerge(KyselyAuthTokenRepositoryLive),
  Layer.provideMerge(KyselyAuthSessionRepositoryLive)
)

export const DepLayer = Layer.empty.pipe(
  Layer.provideMerge(AuthDepLayer),
  Layer.provideMerge(UserDepLayer),
  Layer.provideMerge(HealthProfileDepLayer),
  Layer.provideMerge(DailyMealPlanDepLayer),
  // Layer.provideMerge(LLMDepLayer),
  Layer.provideMerge(StorageDepLayer),
  Layer.provideMerge(MailerLayer),
  Layer.provideMerge(DatabaseLayer)
)

export const ApiEndpointLayer = Layer.empty.pipe(
  Layer.provideMerge(AuthApiLive),
  Layer.provideMerge(UserApiLive),
  Layer.provideMerge(DailyMealPlanApiLive),
  Layer.provideMerge(StorageApiLive)
  // Layer.provideMerge(AgentApiLive)
)

export const ApiLive = HttpApiBuilder.api(Api).pipe(
  Layer.provide(ApiEndpointLayer),
  Layer.provide(AuthenticationMiddlewareLive),
  Layer.provide(DepLayer)
)

export const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(ApiLive),
  HttpServer.withLogAddress,
  Layer.provide(
    Layer.unwrapEffect(
      Effect.gen(function* () {
        const config = yield* AppConfig
        return NodeHttpServer.layer(createServer, { port: config.server.port })
      })
    )
  )
)

export const LoggerLive = Logger.pretty

export const DevToolsLive = DevTools.layer()
