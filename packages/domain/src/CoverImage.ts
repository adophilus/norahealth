import { Schema } from 'effect'
import Id from './Id'
import Timestamp from './Timestamp'
import Url from './Url'

class CoverImage extends Schema.Class<CoverImage>('CoverImage')({
  public_id: Id,
  timestamp: Timestamp,
  url: Url
}) {}

export default CoverImage
