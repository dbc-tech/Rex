export interface RexSearchCriteria {
  criteria?: Array<Record<string, any>>
  extra_options?: Record<string, Array<any>>
}

export interface RexRequestBody extends RexSearchCriteria {
  limit: number
  offset?: number
}

export interface RexGotHttpRequest {
  json: RexRequestBody
}
