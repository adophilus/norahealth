import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { Layer } from 'effect'
import {
  CreateConversationEndpointLive,
  GetConversationEndpointLive,
  SendMessageEndpointLive
} from './route'

export const AgentApiLive = HttpApiBuilder.group(Api, 'Agents', {
  createConversation: CreateConversationEndpointLive,
  getConversation: GetConversationEndpointLive,
  sendMessage: SendMessageEndpointLive
})
