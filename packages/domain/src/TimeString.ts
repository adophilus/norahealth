import { Schema } from 'effect'

const TimeString = Schema.String.annotations({
  examples: ['12:00']
})

export default TimeString
