import { RexAccountUserType } from '../types/rex-account-user.type'

export class RexAccountUser {
  first_name: string
  last_name: string
  email: string
  user_account_status: RexAccountUserType
  id: string
  settings: RexAccountUserSetting
  segmentation_role: RexAccountUserSegmentation
}

export class RexAccountUserSegmentation {
  id: string
  text: string
  sub_text: string
}

export class RexAccountUserSetting {
  phone_mobile: string
  position: string
  default_location: RexLocation
}

export class RexLocation {
  id: string
  text: string
}
