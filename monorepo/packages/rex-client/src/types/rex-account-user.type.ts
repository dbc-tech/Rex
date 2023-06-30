import { RexAccountUserStatus } from '../constants'
import { ObjectToUnion } from '../utils'

export type RexAccountUserType = ObjectToUnion<typeof RexAccountUserStatus>
