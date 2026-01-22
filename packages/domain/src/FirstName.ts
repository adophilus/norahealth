import { Schema } from 'effect'

const FirstName = Schema.String.annotations({
  examples: ['Mary']
})

export default FirstName
