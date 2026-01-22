import { HttpApiGroup } from '@effect/platform'
import GetNeynarSignerStatusEndpoint from './GetNeynarSignerStatusEndpoint'
import GetNeynarSignInNonceEndpoint from './GetNeynarSignInNonceEndpoint'
import GetNeynarSignInUrlEndpoint from './GetNeynarSignInUrlEndpoint'
import VerifyNeynarSignInNonceEndpoint from './VerifyNeynarSignInNonceEndpoint'
import VerifyNeynarSignInUrlEndpoint from './VerifyNeynarSignInUrlEndpoint'
import CheckNeynarSignerStatusEndpoint from './CheckNeynarSignerStatusEndpoint'
import AuthenticationMiddleware from '../Auth/AuthenticationMiddleware'

const NeynarApi = HttpApiGroup.make('Neynar')
  .add(GetNeynarSignInUrlEndpoint)
  .add(GetNeynarSignInNonceEndpoint)
  .add(VerifyNeynarSignInUrlEndpoint)
  .add(VerifyNeynarSignInNonceEndpoint)
  .add(GetNeynarSignerStatusEndpoint)
  .add(CheckNeynarSignerStatusEndpoint)
  .middleware(AuthenticationMiddleware)

export default NeynarApi
