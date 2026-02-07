import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { GetDailyMealPlanEndpointLive } from './GetDailyMealPlanEndpoint'

export const DailyMealPlanApiLive = HttpApiBuilder.group(
  Api,
  'DailyMealPlan',
  (handlers) =>
    handlers.handle('getDailyMealPlan', GetDailyMealPlanEndpointLive)
)
