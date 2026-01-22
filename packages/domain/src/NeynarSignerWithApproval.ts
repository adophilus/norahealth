import { Schema } from 'effect'
import NeynarSigner from './NeynarSigner'
import lodash from 'lodash'
import NeynarSignerApproval from './NeynarSignerApproval'

export default class NeynarSignerWithApproval extends Schema.Class<NeynarSignerWithApproval>(
  'NeynarSignerWithApproval'
)({
  ...lodash.omit(NeynarSigner.fields, ['approval']),
  approval: NeynarSignerApproval
}) {}
