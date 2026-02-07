import { HttpApiGroup } from '@effect/platform'
import AuthenticationMiddleware from '../Auth/AuthenticationMiddleware'
import GetWorkoutPlanEndpoint from './GetWorkoutPlanEndpoint'

const WorkoutPlanApi = HttpApiGroup.make('WorkoutPlan')
  .add(GetWorkoutPlanEndpoint)
  .middleware(AuthenticationMiddleware)

export default WorkoutPlanApi
