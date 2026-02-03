import { HttpApiGroup } from '@effect/platform'
import AuthenticationMiddleware from '../Auth/AuthenticationMiddleware'
import CompleteOnboardingEndpoint from './CompleteOnboardingEndpoint'
import DeleteUserProfileEndpoint from './DeleteUserProfileEndpoint'
import FetchUserProfileByIdEndpoint from './FetchUserProfileByIdEndpoint'
import GetProfileEndpoint from './GetProfileEndpoint'
import UpdateUserProfileEndpoint from './UpdateUserProfileEndpoint'

const UserApi = HttpApiGroup.make('User')
  .add(GetProfileEndpoint)
  .add(UpdateUserProfileEndpoint)
  .add(DeleteUserProfileEndpoint)
  .add(FetchUserProfileByIdEndpoint)
  .add(CompleteOnboardingEndpoint)
  .middleware(AuthenticationMiddleware)

export default UserApi
