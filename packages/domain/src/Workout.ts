import { Schema } from 'effect'
import { Id } from './Id'
import Timestamp from './Timestamp'

export const WorkoutType = Schema.Literal(
  'CARDIO',
  'STRENGTH',
  'FLEXIBILITY',
  'HIIT',
  'COMPOUND'
)

export default class Workout extends Schema.Class<Workout>('Workout')({
  id: Id,
  user_id: Id,
  name: Schema.String,
  type: WorkoutType,
  is_outdoor: Schema.Boolean,
  exercises: Schema.String,
  difficulty_level: Schema.Literal('BEGINNER', 'INTERMEDIATE', 'ADVANCED'),
  duration_minutes: Schema.NullOr(Schema.Number),
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp)
}) {}
