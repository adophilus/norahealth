import { Schema } from 'effect'
import { NeynarSignerStatus } from './NeynarSignerStatus'
import Timestamp from './Timestamp'
import Id from './Id'
import NeynarSignerApproval from './NeynarSignerApproval'

export default class NeynarSigner extends Schema.Class<NeynarSigner>(
  'NeynarSigner'
)({
  id: Id,
  signer_uuid: Schema.String,
  public_key: Schema.String,
  fid: Schema.NullOr(Schema.String),
  status: NeynarSignerStatus,
  approval: Schema.NullOr(NeynarSignerApproval),
  connected_account_id: Id,
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp)
}) {}
