import { HttpApiGroup } from '@effect/platform'
import CreateHealthProfileEndpoint from './CreateHealthProfileEndpoint'

const NotificationsApi = HttpApiGroup.make('Notifications').add(
  CreateHealthProfileEndpoint
)

export default NotificationsApi
