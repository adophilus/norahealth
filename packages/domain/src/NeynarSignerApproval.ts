import { Schema } from 'effect'
import Timestamp from './Timestamp'

export default class NeynarSignerApproval extends Schema.Class<NeynarSignerApproval>(
  'NeynarSignerApproval'
)({
  url: Schema.String,
  deadline: Timestamp
}) {}
