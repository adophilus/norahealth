import { Schema } from 'effect'

class MealLikeMessage extends Schema.Class<MealLikeMessage>('MealLikeMessage')({
  message: Schema.Literal("Meal liked successfully")
}) {}

export default MealLikeMessage 
