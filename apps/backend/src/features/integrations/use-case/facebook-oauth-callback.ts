import { Effect } from 'effect'
import { FacebookOAuthService } from '../service/facebook'

export const facebookOAuthCallbackUseCase = (code: string, state: string) =>
  Effect.gen(function* () {
    const service = yield* FacebookOAuthService
    return yield* service.handleCallback(code, state)
  })
