import { HttpApiEndpoint } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import {
  UnexpectedError,
  DashboardAnalytics,
  DashboardAnalyticsTypeString
} from '../common'
import AuthenticationMiddleware from '../Auth/AuthenticationMiddleware'

// Analytics Request Query
export class DashboardAnalyticsRequestQuery extends Schema.Class<DashboardAnalyticsRequestQuery>(
  'DashboardAnalyticsRequestQuery'
)({
  type: Schema.optional(DashboardAnalyticsTypeString)
}) { }

const DashboardAnalyticsEndpoint = HttpApiEndpoint.get(
  'fetchDashboardAnalytics',
  '/dashboard/analytics'
)
  .setUrlParams(DashboardAnalyticsRequestQuery)
  .addSuccess(DashboardAnalytics)
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .middleware(AuthenticationMiddleware)

export default DashboardAnalyticsEndpoint
