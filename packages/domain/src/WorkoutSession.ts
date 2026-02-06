import { Schema } from 'effect'
import { Id } from './Id'
import Timestamp from './Timestamp'

export const SorenessLevel = Schema.Literal(
  'NONE',
  'MILD',
  'MODERATE',
  'SEVERE'
)

export default class WorkoutSession extends Schema.Class<WorkoutSession>(
  'WorkoutSession'
)({
  id: Id,
  workout_id: Id,
  user_id: Id,
  completed_at: Timestamp,
  soreness_level: Schema.NullOr(SorenessLevel),
  duration_minutes: Schema.NullOr(Schema.Number),
  notes: Schema.NullOr(Schema.String),
  created_at: Timestamp
}) {}
