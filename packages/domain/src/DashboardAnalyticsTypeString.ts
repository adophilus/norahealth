import { Schema } from 'effect'

class DashboardAnalyticsTypeString extends Schema.Union(
  Schema.Literal('total'),
  Schema.Literal('vendor'),
  Schema.Literal('profit')
) { }

export default DashboardAnalyticsTypeString
