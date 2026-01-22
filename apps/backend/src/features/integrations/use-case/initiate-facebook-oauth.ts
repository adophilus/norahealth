import { Effect } from 'effect'
import { FacebookOAuthService } from '../service/facebook'

export const initiateFacebookOAuthUseCase = (userId: string) =>
  Effect.gen(function* () {
    const service = yield* FacebookOAuthService
    return yield* service.generateAuthUrl(userId)
  })
