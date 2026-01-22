import { Schema } from 'effect'
import Id from './Id'
import Timestamp from './Timestamp'

class CreatorAnalytics extends Schema.Class<CreatorAnalytics>(
  'CreatorAnalytics'
)({
  id: Id,
  creator_profile_id: Id,
  total_posts: Schema.Number,
  total_impressions: Schema.Number,
  total_engagements: Schema.Number,
  total_followers: Schema.Number,
  engagement_rate: Schema.Number,
  average_likes_per_post: Schema.Number,
  average_comments_per_post: Schema.Number,
  average_shares_per_post: Schema.Number,
  top_performing_post_id: Schema.NullOr(Id),
  period_start: Timestamp,
  period_end: Timestamp,
  created_at: Timestamp
}) {}

export default CreatorAnalytics
