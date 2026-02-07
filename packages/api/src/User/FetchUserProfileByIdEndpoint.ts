import { HttpApiEndpoint } from '@effect/platform'
import { FullUser, Id } from '@nora-health/domain'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { NotFoundError, UnexpectedError } from '../common'

export class FetchUserProfileByIdRequestPath extends Schema.Class<FetchUserProfileByIdRequestPath>(
  'FetchUserProfileByIdRequestPath'
)({
  userId: Id
}) {}

const FetchUserProfileByIdEndpoint = HttpApiEndpoint.get(
  'fetchUserProfileById',
  '/users/:userId'
)
  .setPath(FetchUserProfileByIdRequestPath)
  .addSuccess(FullUser)
  .addError(NotFoundError, { status: StatusCodes.NOT_FOUND })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })

export default FetchUserProfileByIdEndpoint
