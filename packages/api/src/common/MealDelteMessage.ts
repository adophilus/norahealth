
import { Schema } from 'effect'

class MealDelteMessage extends Schema.Class<MealDelteMessage>('MealDelteMessage')({
  message: Schema.Literal("Meal deleted successfully")
}) {}

export default MealDelteMessage
