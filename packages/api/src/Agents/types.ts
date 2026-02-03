import { Id } from '@nora-health/domain'
import { Schema } from 'effect'

export class CreateConversationRequestBody extends Schema.Class<CreateConversationRequestBody>(
  'CreateConversationRequestBody'
)({
  user_id: Id,
  agent_type: Schema.Literal(
    'INTAKE_SAFETY',
    'MEAL_PLANNER',
    'EXERCISE_COACH',
    'LOGISTICS'
  ),
  initial_message: Schema.String,
  context: Schema.NullOr(
    Schema.Record({ key: Schema.String, value: Schema.Unknown })
  )
}) {}

export class ConversationResponse extends Schema.Class<ConversationResponse>(
  'ConversationResponse'
)({
  id: Id,
  user_id: Id,
  agent_type: Schema.Literal(
    'INTAKE_SAFETY',
    'MEAL_PLANNER',
    'EXERCISE_COACH',
    'LOGISTICS'
  ),
  messages: Schema.String,
  context: Schema.NullOr(Schema.String),
  created_at: Schema.Number,
  updated_at: Schema.NullOr(Schema.Number)
}) {}

export class SendMessageRequestBody extends Schema.Class<SendMessageRequestBody>(
  'SendMessageRequestBody'
)({
  message: Schema.String,
  context: Schema.NullOr(
    Schema.Record({ key: Schema.String, value: Schema.Unknown })
  )
}) {}

export class SendMessageResponse extends Schema.Class<SendMessageResponse>(
  'SendMessageResponse'
)({
  conversation_id: Id,
  agent_response: Schema.String,
  messages: Schema.String,
  updated_at: Schema.Number
}) {}

export class GetConversationResponse extends Schema.Class<GetConversationResponse>(
  'GetConversationResponse'
)({
  id: Id,
  user_id: Id,
  agent_type: Schema.Literal(
    'INTAKE_SAFETY',
    'MEAL_PLANNER',
    'EXERCISE_COACH',
    'LOGISTICS'
  ),
  messages: Schema.String,
  context: Schema.NullOr(Schema.String),
  created_at: Schema.Number,
  updated_at: Schema.NullOr(Schema.Number)
}) {}
