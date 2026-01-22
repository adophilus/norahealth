import { Schema } from 'effect'

class DashboardInfo extends Schema.Class<DashboardInfo>('DashboardInfo')({
  connected_accounts: Schema.Number,
  total_posts: Schema.Number,
  scheduled_posts: Schema.Number,
  published_posts: Schema.Number,
  draft_posts: Schema.Number
}) {}

export default DashboardInfo
