import { HttpApiGroup } from '@effect/platform'
import AuthenticationMiddleware from '../Auth/AuthenticationMiddleware'
import DisconnectAccountEndpoint from './DisconnectAccountEndpoint'
import FacebookOAuthCallbackEndpoint from './FacebookOAuthCallbackEndpoint'
import GetConnectedAccountsEndpoint from './GetConnectedAccountsEndpoint'
import InitiateFacebookOAuthEndpoint from './InitiateFacebookOAuthEndpoint'

const IntegrationsApi = HttpApiGroup.make('Integrations')
  .add(InitiateFacebookOAuthEndpoint)
  .add(FacebookOAuthCallbackEndpoint)
  .add(GetConnectedAccountsEndpoint)
  .add(DisconnectAccountEndpoint)
  .middleware(AuthenticationMiddleware)

export default IntegrationsApi
