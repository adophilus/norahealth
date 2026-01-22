import { HttpApiGroup } from '@effect/platform'
import ResendVerificationOtpEndpoint from './ResendVerificationOtpEndpoint'
import SendSignInOtpEndpoint from './SendSignInOtpEndpoint'
import VerifyOtpEndpoint from './VerifyOtpEndpoint'
import GetSignInWithFarcasterUrlEndpoint from './GetSignInWithFarcasterUrlEndpoint'
import GetSignInWithFarcasterNonceEndpoint from './GetSignInWithFarcasterNonceEndpoint'
import VerifySignInWithFarcasterUrlEndpoint from './VerifySignInWithFarcasterUrlEndpoint'
import VerifySignInWithFarcasterNonceEndpoint from './VerifySignInWithFarcasterNonceEndpoint'

const AuthApi = HttpApiGroup.make('Auth')
  .add(SendSignInOtpEndpoint)
  .add(VerifyOtpEndpoint)
  .add(ResendVerificationOtpEndpoint)
  .add(GetSignInWithFarcasterUrlEndpoint)
  .add(GetSignInWithFarcasterNonceEndpoint)
  .add(VerifySignInWithFarcasterUrlEndpoint)
  .add(VerifySignInWithFarcasterNonceEndpoint)

export default AuthApi
