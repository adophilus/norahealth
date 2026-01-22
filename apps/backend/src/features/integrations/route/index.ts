import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import DisconnectAccountEndpointLive from './DisconnectAccountEndpoint'
import FacebookOAuthCallbackEndpointLive from './FacebookOAuthCallbackEndpoint'
import GetConnectedAccountsEndpointLive from './GetConnectedAccountsEndpoint'
import InitiateFacebookOAuthEndpointLive from './InitiateFacebookOAuthEndpoint'

export const IntegrationsApiLive = HttpApiBuilder.group(
  Api,
  'Integrations',
  (handlers) =>
    handlers
      .handle('initiateFacebookOAuth', InitiateFacebookOAuthEndpointLive)
      .handle('facebookOAuthCallback', FacebookOAuthCallbackEndpointLive)
      .handle('getConnectedAccounts', GetConnectedAccountsEndpointLive)
      .handle('disconnectAccount', DisconnectAccountEndpointLive)
)
