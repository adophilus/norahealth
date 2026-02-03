import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError, UnexpectedError } from '../common'
import { SendMessageRequestBody, SendMessageResponse } from './types'

const SendMessageEndpoint = HttpApiEndpoint.post(
  'sendMessage',
  '/agents/conversations/:id/messages'
)
  .setPayload(SendMessageRequestBody)
  .addSuccess(SendMessageResponse, { status: StatusCodes.OK })
  .addError(NotFoundError, { status: StatusCodes.NOT_FOUND })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Send a message to an agent conversation')

export default SendMessageEndpoint
