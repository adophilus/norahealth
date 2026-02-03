import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnexpectedError } from '../common'
import { ConversationResponse, CreateConversationRequestBody } from './types'

const CreateConversationEndpoint = HttpApiEndpoint.post(
  'createConversation',
  '/agents/conversations'
)
  .setPayload(CreateConversationRequestBody)
  .addSuccess(ConversationResponse, { status: StatusCodes.CREATED })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Create a new agent conversation')

export default CreateConversationEndpoint
