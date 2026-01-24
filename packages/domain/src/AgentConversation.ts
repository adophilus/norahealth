import { Schema } from 'effect'
import Id from './Id'
import Timestamp from './Timestamp'

export const AgentType = Schema.Literal(
  'INTAKE_SAFETY',
  'MEAL_PLANNER',
  'EXERCISE_COACH',
  'LOGISTICS'
)

export default class AgentConversation extends Schema.Class<AgentConversation>(
  'AgentConversation'
)({
  id: Id,
  user_id: Id,
  agent_type: AgentType,
  messages: Schema.String,
  context: Schema.NullOr(Schema.String),
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp)
}) {}
