import { RexCorrelation } from './rex-correlation'
import { RexCriteria } from './rex-criteria'

export interface RexResponse<T> {
  result: T
  error: unknown
  correlation: RexCorrelation
}

export interface RexSearchResult<T> {
  rows: Array<T>
  total: number
  viewstate_id: string
  criteria: Array<RexCriteria>
  order_by: Array<unknown>
}
