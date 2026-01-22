import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { GetProfileEndpointLive } from './GetProfileEndpoint'
import { UpdateUserProfileEndpointLive } from './UpdateUserProfileEndpoint'
import { DeleteUserProfileEndpointLive } from './DeleteUserProfileEndpoint'
import { FetchUserProfileByIdEndpointLive } from './FetchUserProfileByIdEndpoint'

export const UserApiLive = HttpApiBuilder.group(Api, 'User', (handlers) =>
  handlers
    .handle('getProfile', GetProfileEndpointLive)
    .handle('updateUserProfile', UpdateUserProfileEndpointLive)
    .handle('deleteUserProfile', DeleteUserProfileEndpointLive)
    .handle('fetchUserProfileById', FetchUserProfileByIdEndpointLive)
)
