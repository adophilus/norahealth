import { Schema } from 'effect'
import { Id } from './Id'
import Timestamp from './Timestamp'

export const AgentType = Schema.Literal(
  'INTAKE_SAFETY',
  'MEAL_PLANNER',
  'EXERCISE_COACH',
  'LOGISTICS'
)

export const ConversationRole = Schema.Literal('user', 'assistant', 'system')

export class ConversationMessage extends Schema.Class<ConversationMessage>(
  'ConversationMessage'
)({
  role: ConversationRole,
  content: Schema.String,
  timestamp: Schema.NullOr(Timestamp)
}) {}

export default class AgentConversation extends Schema.Class<AgentConversation>(
  'AgentConversation'
)({
  id: Id,
  user_id: Id,
  agent_type: AgentType,
  messages: Schema.Array(ConversationMessage),
  context: Schema.NullOr(Schema.String),
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp)
}) {}
