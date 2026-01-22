import { HttpApiGroup } from '@effect/platform'

import FetchDashboardInfoEndpoint from './FetchDashboardInfoEndpoint'
import DashboardAnalyticsEndpoint from './DashboardAnalyticsEndpoint'

const DashboardApi = HttpApiGroup.make('Dashboard')
  .add(FetchDashboardInfoEndpoint)
  .add(DashboardAnalyticsEndpoint)

export default DashboardApi
