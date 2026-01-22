import { Schema } from 'effect'

const TimestampFromString = Schema.NumberFromString.annotations({
  examples: [1762761939]
})

export default TimestampFromString
