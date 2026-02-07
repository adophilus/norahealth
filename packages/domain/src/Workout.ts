import { Schema } from 'effect'
import { FitnessGoal, Injury } from './HealthProfile'
import { Id } from './Id'
import Timestamp from './Timestamp'

export const WorkoutType = Schema.Literal(
  'CARDIO',
  'STRENGTH',
  'FLEXIBILITY',
  'HIIT',
  'COMPOUND'
)

export const BodyTarget = Schema.Literal(
  'FULL_BODY',
  'UPPER_BODY',
  'LOWER_BODY',
  'CORE',
  'BACK',
  'CHEST',
  'SHOULDERS',
  'ARMS',
  'LEGS',
  'CARDIO'
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
  body_targets: Schema.Array(BodyTarget),
  contraindications: Schema.Array(Injury),
  fitness_goals: Schema.Array(FitnessGoal),
  intensity: Schema.Literal('LOW', 'MODERATE', 'HIGH'),
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp)
}) {}

export type BodyTarget = typeof BodyTarget.Type
