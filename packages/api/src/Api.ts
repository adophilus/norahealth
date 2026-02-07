import { HttpApi, OpenApi } from '@effect/platform'
// import AgentsApi from './Agents'
import AuthApi from './Auth'
import DailyMealPlanApi from './DailyMealPlan'
import NotificationsApi from './Notification'
import StorageApi from './Storage'
import UserApi from './User'

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
  .add(DailyMealPlanApi)
  // .add(AgentsApi)
  .add(NotificationsApi)

export default Api
