import { Schema } from 'effect'
import { Id } from './Id'
import Timestamp from './Timestamp'

export class DailyWorkoutPlan extends Schema.Class<DailyWorkoutPlan>(
  'DailyWorkoutPlan'
)({
  id: Id,
  user_id: Id,
  date: Schema.String,
  morning_workout: Schema.NullOr(Id),
  afternoon_workout: Schema.NullOr(Id),
  evening_workout: Schema.NullOr(Id),
  notes: Schema.String,
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp)
}) {}
