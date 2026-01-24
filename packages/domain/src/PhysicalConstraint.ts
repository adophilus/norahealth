import { Schema } from 'effect'

export const PhysicalConstraint = Schema.Literal(
  'KNEE',
  'BACK',
  'SHOULDER',
  'HIP',
  'ANKLE',
  'WRIST',
  'OTHER'
)

export default PhysicalConstraint
