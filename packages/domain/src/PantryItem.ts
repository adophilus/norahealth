import { Schema } from 'effect'
import { Id } from './Id'
import Timestamp from './Timestamp'

export default class PantryItem extends Schema.Class<PantryItem>('PantryItem')({
  id: Id,
  user_id: Id,
  name: Schema.String,
  expiry_date: Schema.NullOr(Timestamp),
  image_url: Schema.NullOr(Id),
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp)
}) {}
