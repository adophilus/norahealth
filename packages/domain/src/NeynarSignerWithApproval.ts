import { Schema } from 'effect'
import NeynarSigner from './NeynarSigner'
import omit from 'lodash/omit'
import NeynarSignerApproval from './NeynarSignerApproval'

export default class NeynarSignerWithApproval extends Schema.Class<NeynarSignerWithApproval>(
  'NeynarSignerWithApproval'
)({
  ...omit(NeynarSigner.fields, ['approval']),
  approval: NeynarSignerApproval
}) {}
