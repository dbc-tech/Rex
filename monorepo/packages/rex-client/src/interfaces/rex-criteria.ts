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
