import { Effect } from 'effect'
import { ConnectedAccountRepository } from '../repository/connected-account'

export const disconnectAccountUseCase = (connectedAccountId: string) =>
  Effect.gen(function* () {
    const repo = yield* ConnectedAccountRepository
    return yield* repo.softDelete(connectedAccountId)
  })
