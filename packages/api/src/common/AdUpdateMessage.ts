import { Schema } from 'effect'

class AdUpdateMessage extends Schema.Class<AdUpdateMessage>('AdUpdateMessage')({
  message: Schema.Literal("Ad updated successfully")
}) {}

export default AdUpdateMessage 
