import { Schema } from 'effect'

const Price = Schema.String.annotations({
  examples: ['1000']
})

export default Price
