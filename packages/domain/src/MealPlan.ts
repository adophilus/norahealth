import { Schema } from 'effect'
import Id from './Id'
import Timestamp from './Timestamp'

export default class MealPlan extends Schema.Class<MealPlan>('MealPlan')({
  id: Id,
  user_id: Id,
  date: Schema.String,
  meals: Schema.Array(Schema.String),
  notes: Schema.NullOr(Schema.String),
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp)
}) {}
