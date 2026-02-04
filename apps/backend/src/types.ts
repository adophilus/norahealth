import type { Insertable, Selectable, Updateable } from 'kysely'
import type { KyselyDatabaseTables } from '@/features/database/kysely'

type ApiCompatibility<T> = T
type KSelectable<T> = Selectable<T>
type KInsertable<T> = Insertable<T>
type KUpdateable<T> = Updateable<T>

type GenerateTypes<T> = {
  Selectable: ApiCompatibility<KSelectable<T>>
  Insertable: ApiCompatibility<KInsertable<T>>
  Updateable: ApiCompatibility<KUpdateable<T>>
}

export namespace User {
  type T = GenerateTypes<KyselyDatabaseTables['users']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace AuthToken {
  type T = GenerateTypes<KyselyDatabaseTables['auth_tokens']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace AuthSession {
  type T = GenerateTypes<KyselyDatabaseTables['auth_sessions']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace StorageFile {
  type T = GenerateTypes<KyselyDatabaseTables['storage_files']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace AgentConversation {
  type T = GenerateTypes<KyselyDatabaseTables['agent_conversations']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace HealthProfile {
  type T = GenerateTypes<KyselyDatabaseTables['health_profiles']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace Meal {
  type T = GenerateTypes<KyselyDatabaseTables['meals']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export const SIGN_UP_VERIFICATION_TOKEN_PURPOSE_KEY = 'SIGN_UP_VERIFICATION'
export const SIGN_IN_VERIFICATION_TOKEN_PURPOSE_KEY = 'SIGN_IN_VERIFICATION'
