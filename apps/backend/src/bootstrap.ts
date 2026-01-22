import { createServer } from 'node:http'
import { DevTools } from '@effect/experimental'
import { HttpApiBuilder, HttpMiddleware, HttpServer } from '@effect/platform'
import { NodeHttpServer } from '@effect/platform-node'
import { Api } from '@nora-health/api'
import { Console, Data, Effect, Layer, Logger } from 'effect'
import type { MigrationResultSet } from 'kysely'
import {
  AuthApiLive,
  AuthenticationMiddlewareLive,
  AuthProfileServiceLive,
  AuthSessionServiceLive,
  EmailAuthTokenServiceLive,
  KyselyAuthProfileRepositoryLive,
  KyselyAuthSessionRepositoryLive,
  KyselyAuthTokenRepositoryLive
} from './features/auth'
import { AppConfig } from './features/config'
import { KyselyClient } from './features/database/kysely'
import { SqliteKyselyClientLive } from './features/database/kysely/db/sqlite'
import { createKyselyMigrator } from './features/database/kysely/migrator'
import {
  ConnectedAccountRepositoryLive,
  FacebookOAuthServiceLive,
  IntegrationsApiLive,
  OAuthTokenRepositoryLive
} from './features/integrations'
import { FarcasterServiceLive } from './features/farcaster'
import { NodemailerMailerLive } from './features/mailer'
import {
  KyselyPostPlatformRepositoryLive,
  KyselyPostRepositoryLive,
  PostApiLive,
  PostPlatformServiceLive,
  PostServiceLive
} from './features/post'
import { StorageApiLive } from './features/storage'
import { KyselyStorageRepositoryLive } from './features/storage/repository'
import { StorageServiceLive } from './features/storage/service'
import { KyselyUserRepositoryLive } from './features/user'
import { UserApiLive } from './features/user/route'
import { UserServiceLive } from './features/user/service'
import {
  KyselyWaitlistRepositoryLive,
  WaitlistApiLive,
  WaitlistServiceLive
} from './features/waitlist'
import {
  KyselyNeynarSignerRepositoryLive,
  NeynarApiLive,
  NeynarServiceLive
} from './features/neynar'

export class DatabaseMigrationFailedError extends Data.TaggedError(
  'DatabaseMigrationFailedError'
)<{
  cause: unknown
}> {}

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

export const AuthDepLayer = AuthSessionServiceLive.pipe(
  Layer.provideMerge(EmailAuthTokenServiceLive),
  Layer.provideMerge(AuthProfileServiceLive),
  Layer.provideMerge(KyselyAuthTokenRepositoryLive),
  Layer.provideMerge(KyselyAuthSessionRepositoryLive),
  Layer.provideMerge(KyselyAuthProfileRepositoryLive)
)

export const WaitlistDepLayer = WaitlistServiceLive.pipe(
  Layer.provide(KyselyWaitlistRepositoryLive)
)

export const PostDepLayer = PostServiceLive.pipe(
  Layer.provideMerge(PostPlatformServiceLive),
  Layer.provideMerge(KyselyPostRepositoryLive),
  Layer.provideMerge(KyselyPostPlatformRepositoryLive)
)

export const IntegrationsDepLayer = FacebookOAuthServiceLive.pipe(
  Layer.provideMerge(ConnectedAccountRepositoryLive),
  Layer.provideMerge(OAuthTokenRepositoryLive)
)

export const FarcasterDepLayer = FarcasterServiceLive.pipe(
  Layer.provideMerge(NeynarServiceLive),
  Layer.provideMerge(KyselyNeynarSignerRepositoryLive)
)

export const DepLayer = AuthDepLayer.pipe(
  Layer.provideMerge(DatabaseLayer),
  Layer.provideMerge(UserDepLayer),
  Layer.provideMerge(WaitlistDepLayer),
  Layer.provideMerge(StorageDepLayer),
  Layer.provideMerge(PostDepLayer),
  Layer.provideMerge(IntegrationsDepLayer),
  Layer.provideMerge(FarcasterDepLayer),
  Layer.provideMerge(MailerLayer),
  Layer.provideMerge(DatabaseLayer),
  Layer.provideMerge(MailerLayer)
)

export const ApiEndpointLayer = AuthApiLive.pipe(
  Layer.provideMerge(UserApiLive),
  Layer.provideMerge(StorageApiLive),
  Layer.provideMerge(WaitlistApiLive),
  Layer.provideMerge(PostApiLive),
  Layer.provideMerge(IntegrationsApiLive),
  Layer.provideMerge(NeynarApiLive)
)

export const ApiLive = HttpApiBuilder.api(Api).pipe(
  Layer.provide(ApiEndpointLayer),
  Layer.provide(AuthenticationMiddlewareLive),
  Layer.provide(DepLayer)
)

export const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiBuilder.middlewareCors()),
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
