import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { NotFoundError, UnexpectedError } from '../common'
import { GetConversationResponse } from './types'

const GetConversationEndpoint = HttpApiEndpoint.get(
  'getConversation',
  '/agents/conversations/:id'
)
  .addSuccess(GetConversationResponse)
  .addError(NotFoundError, { status: StatusCodes.NOT_FOUND })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Get an agent conversation by ID')

export default GetConversationEndpoint
