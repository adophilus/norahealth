import { Schema } from 'effect'
import Id from './Id'
import Timestamp from './Timestamp'

export default class DailyTarget extends Schema.Class<DailyTarget>(
  'DailyTarget'
)({
  id: Id,
  user_id: Id,
  date: Schema.String,
  meal_plan_id: Schema.NullOr(Id),
  workout_id: Schema.NullOr(Id),
  meal_completed: Schema.Boolean,
  workout_completed: Schema.Boolean,
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp)
}) {}
