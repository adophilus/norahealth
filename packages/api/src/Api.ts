import { HttpApi, OpenApi } from '@effect/platform'
import AuthApi from './Auth'
import IntegrationsApi from './Integrations'
import NeynarApi from './Neynar'
import PostApi from './Post'
import StorageApi from './Storage'
import UserApi from './User'
import WaitlistApi from './Waitlist'

const Api = HttpApi.make('API')
  .annotate(OpenApi.Title, 'API Documentation')
  .annotate(OpenApi.Description, 'API Documentation')
  .annotate(OpenApi.Version, '1.0.0')
  .annotate(OpenApi.Servers, [
    {
      url: 'http://localhost:5000',
      description: 'server'
    }
  ])
  .add(AuthApi)
  .add(StorageApi)
  .add(UserApi)
  .add(WaitlistApi)
  .add(PostApi)
  .add(IntegrationsApi)
  .add(NeynarApi)

export default Api
