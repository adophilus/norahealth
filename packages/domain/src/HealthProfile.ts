import { Schema } from 'effect'
import Email from './Email'
import { Id } from './Id'
import Timestamp from './Timestamp'
import { BodyTarget } from './BodyTarget'

export const AgeGroup = Schema.Literal(
  '18_25',
  '26_35',
  '36_45',
  '46_55',
  '55_PLUS'
)

export const WeightClass = Schema.Literal(
  'UNDERWEIGHT',
  'NORMAL',
  'OVERWEIGHT',
  'OBESE'
)

export const FitnessGoal = Schema.Literal(
  'WEIGHT_LOSS',
  'MUSCLE_GAIN',
  'ENDURANCE',
  'GENERAL_HEALTH',
  'STRENGTH',
  'FLEXIBILITY',
  'STRESS_REDUCTION',
  'SLEEP_IMPROVEMENT',
  'HEART_HEALTH'
)
export type FitnessGoal = typeof FitnessGoal.Type

export const Allergen = Schema.Literal(
  'GLUTEN',
  'MILK',
  'PEANUTS',
  'TREE_NUTS',
  'SOY',
  'EGGS',
  'FISH',
  'SHELLFISH',
  'WHEAT',
  'SESAME'
)
export type Allergen = typeof Allergen.Type

export const Location = Schema.Struct({
  country: Schema.String,
  city: Schema.String
})

export const Injury = Schema.Literal(
  'KNEE',
  'SHOULDER',
  'BACK',
  'ANKLE',
  'WRIST',
  'HIP',
  'ELBOW',
  'NECK',
  'FOOT'
)

export type Injury = typeof Injury.Type

export const MedicalConditions = Schema.Record({
  key: Schema.String,
  value: Schema.Any
})

export class HealthProfile extends Schema.Class<HealthProfile>('HealthProfile')(
  {
    id: Id,
    user_id: Id,
    name: Schema.String.pipe(Schema.maxLength(100)),
    email: Email,
    age_group: AgeGroup,
    gender: Schema.Literal('MALE', 'FEMALE', 'RATHER_NOT_SAY'),
    weight_class: WeightClass,
    injuries: Schema.Array(Injury),
    medical_conditions: MedicalConditions,
    fitness_goals: Schema.Array(FitnessGoal),
    body_targets: Schema.Array(BodyTarget),
    weekly_workout_time: Schema.Number,
    allergies: Schema.Array(Allergen),
    location: Location,
    created_at: Timestamp,
    updated_at: Schema.NullOr(Timestamp)
  }
) {}
