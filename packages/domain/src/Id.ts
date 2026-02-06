import { Schema } from 'effect'

export const Id = Schema.String.annotations({
  examples: ['f47ac10b-58cc-4372-a567-0e02b2c3d479']
})

export type Id = typeof Id.Type
