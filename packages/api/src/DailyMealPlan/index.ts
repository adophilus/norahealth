import { HttpApiGroup } from '@effect/platform'
import AuthenticationMiddleware from '../Auth/AuthenticationMiddleware'
import GetDailyMealPlanEndpoint from './GetDailyMealPlanEndpoint'

const DailyMealPlanApi = HttpApiGroup.make('DailyMealPlan')
  .add(GetDailyMealPlanEndpoint)
  .middleware(AuthenticationMiddleware)

export default DailyMealPlanApi
