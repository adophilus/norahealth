import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { SendSignInOtpEndpointLive } from './SendSignInOtpEndpoint'
import { VerifyOtpEndpointLive } from './VerifyOtpEndpoint'

export const AuthApiLive = HttpApiBuilder.group(Api, 'Auth', (handlers) =>
  handlers
    .handle('sendSignInOtp', SendSignInOtpEndpointLive)
    .handle('verifyOtp', VerifyOtpEndpointLive)
)
