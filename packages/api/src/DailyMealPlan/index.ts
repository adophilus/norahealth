import { HttpApiGroup } from '@effect/platform'
import AuthenticationMiddleware from '../Auth/AuthenticationMiddleware'
import GenerateWeeklyPlanEndpoint from './GenerateWeeklyPlanEndpoint'
import GetWeeklyPlanEndpoint from './GetWeeklyPlanEndpoint'
import UpdateDayPlanEndpoint from './UpdateDayPlanEndpoint'

const DailyMealPlanApi = HttpApiGroup.make('DailyMealPlan')
  .add(GenerateWeeklyPlanEndpoint)
  .add(GetWeeklyPlanEndpoint)
  .add(UpdateDayPlanEndpoint)
  .middleware(AuthenticationMiddleware)

export default DailyMealPlanApi
