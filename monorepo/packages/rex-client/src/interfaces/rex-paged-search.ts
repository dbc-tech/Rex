import { RexSearchCriteria } from './rex-search-criteria'

export interface RexPagedSearch extends RexSearchCriteria {
  limit: number
  offset?: number
}
