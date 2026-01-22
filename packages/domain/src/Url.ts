import { Schema } from 'effect'

const Url = Schema.String.annotations({
  examples: ['https://example.com/image.png']
})

export default Url
