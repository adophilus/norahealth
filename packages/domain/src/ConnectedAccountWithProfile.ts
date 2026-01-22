import { Schema } from 'effect'
import ConnectedAccount from './ConnectedAccount'
import NeynarSigner from './NeynarSigner'

class ConnectedAccountWithProfile extends Schema.Class<ConnectedAccountWithProfile>(
  'ConnectedAccountWithProfile'
)({
  ...ConnectedAccount.fields,
  profile: Schema.Union(NeynarSigner)
}) {}

export default ConnectedAccountWithProfile
