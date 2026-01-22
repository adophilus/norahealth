import { HttpApiGroup } from '@effect/platform'

import GetProfileEndpoint from './GetProfileEndpoint'
import UpdateUserProfileEndpoint from './UpdateUserProfileEndpoint'
import DeleteUserProfileEndpoint from './DeleteUserProfileEndpoint'
import FetchUserProfileByIdEndpoint from './FetchUserProfileByIdEndpoint'
import AuthenticationMiddleware from '../Auth/AuthenticationMiddleware'

const UserApi = HttpApiGroup.make('User')
  .add(GetProfileEndpoint)
  .add(UpdateUserProfileEndpoint)
  .add(DeleteUserProfileEndpoint)
  .add(FetchUserProfileByIdEndpoint)
  .middleware(AuthenticationMiddleware)

export default UserApi
