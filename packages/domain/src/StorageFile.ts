import { Schema } from 'effect'
import { Id } from './Id'
import Timestamp from './Timestamp'

class StorageFile extends Schema.Class<StorageFile>('StorageFile')({
  id: Id,
  original_name: Schema.String,
  file_data: Schema.Uint8Array,
  mime_type: Schema.String,
  user_id: Id,
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp)
}) {}

export default StorageFile
