import type {
  AuthProfile,
  AuthSession,
  AuthToken,
  ConnectedAccount,
  NeynarSigner,
  OAuthToken,
  Post,
  PostPlatform,
  StorageFile,
  User,
  WaitlistEntry
} from '@nora-health/domain'
import type { ColumnType } from 'kysely'

type Id = ColumnType<string, string, never>

type TimestampModel = {
  created_at: ColumnType<number, never, never>
  updated_at: ColumnType<number | null, never, number>
}

type WithTimestamp<T> = Omit<T, 'created_at' | 'updated_at'> & TimestampModel
type WithImmutableId<T> = Omit<T, 'id'> & { id: Id }

type UsersTable = WithImmutableId<WithTimestamp<User>>
type AuthTokensTable = WithImmutableId<
  WithTimestamp<Omit<AuthToken, 'provider'> & { provider: string }>
>
type AuthSessionsTable = WithImmutableId<WithTimestamp<AuthSession>>
type WaitlistEntryTable = WithImmutableId<WithTimestamp<WaitlistEntry>>
type AuthProfilesTable = WithImmutableId<
  WithTimestamp<
    Omit<AuthProfile, 'meta'> & {
      meta: string
    }
  >
>
type PostsTable = WithImmutableId<
  WithTimestamp<
    Omit<Post, 'media_ids'> & {
      media_ids: string
    }
  >
>
type PostPlatformTable = WithImmutableId<WithTimestamp<PostPlatform>>

type StorageFilesTable = WithImmutableId<WithTimestamp<StorageFile>>

type ConnectedAccountsTable = WithImmutableId<WithTimestamp<ConnectedAccount>>
type OAuthTokensTable = WithImmutableId<WithTimestamp<OAuthToken>>

type NeynarSignersTable = WithImmutableId<
  WithTimestamp<
    Omit<NeynarSigner, 'approval'> & {
      approval: string | null
    }
  >
>

export type KyselyDatabaseTables = {
  users: UsersTable
  auth_tokens: AuthTokensTable
  auth_sessions: AuthSessionsTable
  storage_files: StorageFilesTable
  waitlist_entries: WaitlistEntryTable
  auth_profiles: AuthProfilesTable
  posts: PostsTable
  post_platform: PostPlatformTable
  connected_accounts: ConnectedAccountsTable
  oauth_tokens: OAuthTokensTable
  neynar_signers: NeynarSignersTable
}
