import { HttpApiGroup } from '@effect/platform'
import CreateConversationEndpoint from './CreateConversationEndpoint'
import GetConversationEndpoint from './GetConversationEndpoint'
import SendMessageEndpoint from './SendMessageEndpoint'

const AgentsApi = HttpApiGroup.make('Agents')
  .add(CreateConversationEndpoint)
  .add(SendMessageEndpoint)
  .add(GetConversationEndpoint)

export default AgentsApi
