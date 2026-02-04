import { Schema } from 'effect'
import Id from './Id'
import Timestamp from './Timestamp'

export default class DailyMealPlan extends Schema.Class<DailyMealPlan>(
  'DailyMealPlan'
)({
  id: Id,
  user_id: Id,
  date: Schema.String,
  breakfast: Schema.NullOr(Id),
  lunch: Schema.NullOr(Id),
  dinner: Schema.NullOr(Id),
  snacks: Schema.Array(Id),
  notes: Schema.String,
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp),
  deleted_at: Schema.NullOr(Timestamp)
}) {}
