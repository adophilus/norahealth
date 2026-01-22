import { Schema } from 'effect'
import Post from './Post'
import { PaginationMeta } from './Pagination'

class DashboardAnalytics extends Schema.Class<DashboardAnalytics>(
  'DashboardAnalytics'
)({
  data: Schema.Struct({
    items: Schema.Array(Post),
    meta: PaginationMeta
  }),
  total_posts: Schema.Number,
  total_impressions: Schema.Number,
  total_engagements: Schema.Number
}) {}

export default DashboardAnalytics
