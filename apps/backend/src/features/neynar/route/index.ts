import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import CheckNeynarStatusEndpointLive from './CheckNeynarSignerStatusEndpoint'
import GetNeynarSignInUrlEndpointLive from './GetNeynarSignInUrlEndpoint'
import GetNeynarSignInNonceEndpointLive from './GetNeynarSignInNonceEndpoint'
import VerifyNeynarSignInUrlEndpointLive from './VerifyNeynarSignInUrlEndpoint'
import VerifyNeynarSignInNonceEndpointLive from './VerifyNeynarSignInNonceEndpoint'

export const NeynarApiLive = HttpApiBuilder.group(
  Api,
  'Neynar',
  (handlers) =>
    handlers
      .handle('checkNeynarSignerStatus', CheckNeynarStatusEndpointLive)
      .handle('getNeynarSignInUrl', GetNeynarSignInUrlEndpointLive)
      .handle('getNeynarSignInNonce', GetNeynarSignInNonceEndpointLive)
      .handle('verifyNeynarSignInUrl', VerifyNeynarSignInUrlEndpointLive)
      .handle('verifyNeynarSignInNonce', VerifyNeynarSignInNonceEndpointLive)
)
