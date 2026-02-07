import { Schema } from 'effect'

export const WorkoutType = Schema.Literal(
  'CARDIO',
  'STRENGTH',
  'FLEXIBILITY',
  'HIIT',
  'COMPOUND'
)

export type WorkoutType = typeof WorkoutType.Type
