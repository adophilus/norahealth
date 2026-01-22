import { HttpApiEndpoint } from '@effect/platform'
import { StatusCodes } from 'http-status-codes'
import { UnexpectedError, DashboardInfo } from '../common'
import AuthenticationMiddleware from '../Auth/AuthenticationMiddleware'

// Fetch info
const FetchDashboardInfoEndpoint = HttpApiEndpoint.get(
  'fetchDashboardInfo',
  '/dashboard/info'
)
  .addSuccess(DashboardInfo)
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .middleware(AuthenticationMiddleware)

export default FetchDashboardInfoEndpoint
