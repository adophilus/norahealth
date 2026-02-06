import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { CompleteOnboardingEndpointLive } from './CompleteOnboardingEndpoint'
import { DeleteUserProfileEndpointLive } from './DeleteUserProfileEndpoint'
import { FetchUserProfileByIdEndpointLive } from './FetchUserProfileByIdEndpoint'
import { GetProfileEndpointLive } from './GetProfileEndpoint'
import { UpdateUserProfileEndpointLive } from './UpdateUserProfileEndpoint'

export const UserApiLive = HttpApiBuilder.group(Api, 'User', (handlers) =>
  handlers
    .handle('getProfile', GetProfileEndpointLive)
    .handle('updateUserProfile', UpdateUserProfileEndpointLive)
    .handle('deleteUserProfile', DeleteUserProfileEndpointLive)
    .handle('fetchUserProfileById', FetchUserProfileByIdEndpointLive)
    .handle('completeOnboarding', CompleteOnboardingEndpointLive)
)
