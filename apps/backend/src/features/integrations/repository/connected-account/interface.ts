import { Context, type Effect, type Option } from 'effect'
import type { ConnectedAccount as TConnectedAccount } from '@/types'
import type {
  AlreadyConnectedError,
  ConnectedAccountNotFoundError,
  ConnectedAccountRepositoryError
} from './error'
import type { PlatformName } from '@nora-health/domain'

export class ConnectedAccountRepository extends Context.Tag(
  'ConnectedAccountRepository'
)<
  ConnectedAccountRepository,
  {
    create: (
      payload: TConnectedAccount.Insertable
    ) => Effect.Effect<
      TConnectedAccount.Selectable,
      ConnectedAccountRepositoryError | AlreadyConnectedError
    >

    findByUserId: (
      userId: string
    ) => Effect.Effect<
      TConnectedAccount.Selectable[],
      ConnectedAccountRepositoryError
    >

    findById: (
      id: string
    ) => Effect.Effect<
      Option.Option<TConnectedAccount.Selectable>,
      ConnectedAccountRepositoryError
    >

    findByUserIdAndPlatform: (
      userId: string,
      platform: PlatformName
    ) => Effect.Effect<
      Option.Option<TConnectedAccount.Selectable>,
      ConnectedAccountRepositoryError
    >

    update: (
      id: string,
      payload: Omit<TConnectedAccount.Updateable, 'updated_at'>
    ) => Effect.Effect<
      TConnectedAccount.Selectable,
      ConnectedAccountRepositoryError | ConnectedAccountNotFoundError
    >

    softDelete: (
      id: string
    ) => Effect.Effect<
      void,
      ConnectedAccountRepositoryError | ConnectedAccountNotFoundError
    >
  }
>() {}
