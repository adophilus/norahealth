import { Schema } from 'effect'

class MealUpdateMessage extends Schema.Class<MealUpdateMessage>('MealUpdateMessage')({
  message: Schema.Literal("Meal updated successfully")
}) {}

export default MealUpdateMessage
