import { Schema } from 'effect'
import { NeynarSignerStatus } from './NeynarSignerStatus'

export default class RawNeynarSigner extends Schema.Class<RawNeynarSigner>(
  'RawNeynarSigner'
)({
  signer_uuid: Schema.String,
  public_key: Schema.String,
  fid: Schema.Number.pipe(Schema.optional),
  status: NeynarSignerStatus,
}) {}
