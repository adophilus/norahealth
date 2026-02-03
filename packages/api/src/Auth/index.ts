import { HttpApiGroup } from '@effect/platform'
import ResendVerificationOtpEndpoint from './ResendVerificationOtpEndpoint'
import SendSignInOtpEndpoint from './SendSignInOtpEndpoint'
import VerifyOtpEndpoint from './VerifyOtpEndpoint'

const AuthApi = HttpApiGroup.make('Auth')
  .add(SendSignInOtpEndpoint)
  .add(VerifyOtpEndpoint)

export default AuthApi
