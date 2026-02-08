import { HttpApi, OpenApi } from '@effect/platform'
import AgentsApi from './Agents/index'
import AuthApi from './Auth/index'
import MarketplaceApi from './Marketplace/index'
import MealsApi from './Meals/index'
import NotificationsApi from './Notification/index'
import OnboardingApi from './Onboarding/index'
import ProgressApi from './Progress/index'
import StorageApi from './Storage/index'
import UserApi from './User/index'
import WorkoutsApi from './Workouts/index'

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
  .add(WorkoutPlanApi)
// .add(AgentsApi)
// .add(NotificationsApi)

export default Api
