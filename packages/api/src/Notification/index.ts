import { HttpApiGroup } from '@effect/platform'
import RegisterPushTokenEndpoint from './RegisterPushTokenEndpoint'

const NotificationApi = HttpApiGroup.make('Notification').add(
  RegisterPushTokenEndpoint
)

export default NotificationApi
