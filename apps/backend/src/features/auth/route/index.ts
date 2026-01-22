import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { ResendVerificationOtpEndpointLive } from './ResendVerificationOtpEndpoint'
import { SendSignInOtpEndpointLive } from './SendSignInOtpEndpoint'
import { VerifyOtpEndpointLive } from './VerifyOtpEndpoint'
import { GetSignInWithFarcasterNonceEndpointLive } from './GetSignInWithFarcasterNonceEndpoint'
import { GetSignInWithFarcasterUrlEndpointLive } from './GetSignInWithFarcasterUrlEndpoint'
import { VerifySignInWithFarcasterNonceEndpointLive } from './VerifySignInWithFarcasterNonceEndpoint'
import { VerifySignInWithFarcasterUrlEndpointLive } from './VerifySignInWithFarcasterUrlEndpoint'

export const AuthApiLive = HttpApiBuilder.group(Api, 'Auth', (handlers) =>
  handlers
    .handle('sendSignInOtp', SendSignInOtpEndpointLive)
    .handle('resendVerificationOtp', ResendVerificationOtpEndpointLive)
    .handle('verifyOtp', VerifyOtpEndpointLive)
    .handle(
      'getSignInWithFarcasterNonce',
      GetSignInWithFarcasterNonceEndpointLive
    )
    .handle(
      'verifySignInWithFarcasterNonce',
      VerifySignInWithFarcasterNonceEndpointLive
    )
    .handle('getSignInWithFarcasterUrl', GetSignInWithFarcasterUrlEndpointLive)
    .handle(
      'verifySignInWithFarcasterUrl',
      VerifySignInWithFarcasterUrlEndpointLive
    )
)
