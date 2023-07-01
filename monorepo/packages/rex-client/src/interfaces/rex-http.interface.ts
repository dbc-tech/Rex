export interface RexCriteria {
  name: string
  type?:
    | '='
    | '>'
    | '>='
    | '<'
    | '<='
    | 'is'
    | 'isnot'
    | 'between'
    | 'in'
    | 'intersect_any'
    | 'intersect_all'
    | 'intersect_all_right'
    | 'intersect_none'
  value: any
}

export interface RexSearchCriteria {
  criteria?: Array<RexCriteria>
  extra_options?: Record<string, Array<any>>
}

export interface RexRequestBody extends RexSearchCriteria {
  limit: number
  offset?: number
}

export interface RexGotHttpRequest {
  json: RexRequestBody
}

export interface RexResponse<T> {
  result: {
    rows: Array<T>
    total: number
    viewstate_id: string
    criteria: Array<RexCriteria>
    order_by: Array<unknown>
  }
  error: unknown
  correlation: {
    request_id: string
    correlation_id: string
    async_correlation_id: string
  }
}
