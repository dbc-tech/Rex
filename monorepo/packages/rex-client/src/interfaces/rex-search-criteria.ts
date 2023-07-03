import { RexCriteria } from './rex-criteria'

export interface RexSearchCriteria {
  criteria?: Array<RexCriteria>
  extra_options?: Record<string, Array<any>>
}
