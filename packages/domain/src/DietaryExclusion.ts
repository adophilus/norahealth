import { Schema } from 'effect'

export const DietaryExclusion = Schema.Literal(
  'PEANUTS',
  'DAIRY',
  'GLUTEN',
  'SOY',
  'EGGS',
  'SHELLFISH',
  'TREE_NUTS',
  'FISH'
)

export default DietaryExclusion
