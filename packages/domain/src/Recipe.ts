import { Schema } from 'effect'
import Id from './Id'
import Timestamp from './Timestamp'

export default class Recipe extends Schema.Class<Recipe>('Recipe')({
  id: Id,
  user_id: Id,
  name: Schema.String,
  ingredients: Schema.Array(Schema.String),
  instructions: Schema.Array(Schema.String),
  calories: Schema.NullOr(Schema.Number),
  protein: Schema.NullOr(Schema.Number),
  carbs: Schema.NullOr(Schema.Number),
  fat: Schema.NullOr(Schema.Number),
  prep_time_minutes: Schema.NullOr(Schema.Number),
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp)
}) {}
