import { Schema } from 'effect'

class MealUnlikeMessage extends Schema.Class<MealUnlikeMessage>('MealUnlikeMessage')({
  message: Schema.Literal("Meal unliked successfully")
}) {}

export default MealUnlikeMessage
