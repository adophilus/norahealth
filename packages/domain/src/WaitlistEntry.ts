import { Schema } from 'effect'
import { Id } from './Id'
import Timestamp from './Timestamp'
import Email from './Email'

class WaitlistEntry extends Schema.Class<WaitlistEntry>('WaitlistEntry')({
  id: Id,
  email: Email,
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp)
}) {}

export default WaitlistEntry
