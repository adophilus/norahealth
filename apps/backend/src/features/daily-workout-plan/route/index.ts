import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { GetWorkoutPlanEndpointLive } from './GetWorkoutPlanEndpoint'

export const DailyWorkoutPlanApiLive = HttpApiBuilder.group(
  Api,
  'WorkoutPlan',
  (handlers) => handlers.handle('getWorkoutPlan', GetWorkoutPlanEndpointLive)
)
