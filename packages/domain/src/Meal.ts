import { Schema } from 'effect'
import { Allergen, FitnessGoal } from './HealthProfile'
import Id from './Id'
import Timestamp from './Timestamp'

export const FoodClass = Schema.Literal(
  'PROTEIN',
  'CARBOHYDRATE',
  'VEGETABLE',
  'FRUIT',
  'DAIRY',
  'FAT',
  'GRAIN',
  'LEGUME',
  'NUT',
  'SEED'
)

export class Meal extends Schema.Class<Meal>('Meal')({
  id: Id,
  name: Schema.String,
  description: Schema.NullOr(Schema.String),
  food_classes: Schema.Array(FoodClass),
  calories: Schema.NullOr(Schema.Number),
  protein: Schema.NullOr(Schema.Number),
  carbs: Schema.NullOr(Schema.Number),
  fat: Schema.NullOr(Schema.Number),
  prep_time_minutes: Schema.NullOr(Schema.Number),
  cover_image_id: Schema.NullOr(Id),
  allergens: Schema.Array(Allergen),
  is_prepackaged: Schema.Boolean,
  fitness_goals: Schema.Array(FitnessGoal),
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp),
  deleted_at: Schema.NullOr(Timestamp)
}) {}
