import { RexListingState } from '../constants'
import { ObjectToUnion } from '../utils'

export type RexListingStateType = ObjectToUnion<typeof RexListingState>
