import { Schema } from 'effect'

class Message extends Schema.Class<Message>('Message')({
  message: Schema.String
}) { }

export default Message
