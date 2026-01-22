import { Schema } from 'effect'

export const Page = Schema.NumberFromString.annotations({
  examples: [1]
}).pipe()

export const PerPage = Schema.NumberFromString.annotations({ examples: [10] })

export class PaginationQuery extends Schema.Class<PaginationQuery>(
  'PaginationQuery'
)({
  page: Schema.optionalWith(Page, {
    default: () => 1
  }),
  per_page: Schema.optionalWith(PerPage, {
    default: () => 10
  })
}) { }

export class PaginationMeta extends Schema.Class<PaginationMeta>(
  'PaginationMeta'
)({
  page: Schema.Number.annotations({ examples: [1] }),
  per_page: Schema.Number.annotations({ examples: [10] }),
  total: Schema.Number.annotations({ examples: [100] })
}) { }

export const Paginated = <C, A>(tag: string, schema: Schema.Schema<A>) =>
  Schema.TaggedClass<C>()(tag, {
    items: Schema.Array(schema),
    meta: PaginationMeta
  })
