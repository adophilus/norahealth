import { Schema } from 'effect'

class AdDeleteMessage extends Schema.Class<AdDeleteMessage>('AdDeleteMessage')({
  message: Schema.Literal("Ad deleted successfully")
}) {}

export default AdDeleteMessage 
