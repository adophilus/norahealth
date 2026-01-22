import { Effect } from 'effect'
import { ConnectedAccountRepository } from '../repository/connected-account'

export const getConnectedAccountsUseCase = (userId: string) =>
  Effect.gen(function* () {
    const repo = yield* ConnectedAccountRepository
    return yield* repo.findByUserId(userId)
  })
