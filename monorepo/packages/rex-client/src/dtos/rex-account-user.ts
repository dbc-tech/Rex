import { RexAccountUserType } from '../types/rex-account-user.type'

export class RexAccountUser {
  first_name: string
  last_name: string
  email: string
  segmentation_tech_skill: string
  segmentation_transactions_residential: string
  segmentation_transactions_commercial: string
  user_registration_status: string
  auth_service_user_id: string
  user_account_status: RexAccountUserType
  account_user_id: string
  system_ctime: string
  is_multi_account_user: boolean
  system_created_user: RexId
  segmentation_role: RexAccountUserSegmentation
  user_slot_is_billed: boolean
  user_slot_use_type: RexId
  reporting_categories: unknown[]
  user_links: RexUserLink
  settings: RexAccountUserSetting
  related: RexAccountUserRelated
  id: string
}

export class RexAccountUserSegmentation {
  id: string
  text: string
  sub_text: string
}

export class RexAccountUserSetting {
  app_color: string
  email_signature: string
  portal_agent_name: string
  portal_agent_email: string
  portal_agent_phone: string
  phone_direct: string
  phone_mobile: string
  position: string
  profile_bio: string
  default_location: RexLocation
  profile_image: string
}

export class RexId {
  id: string
  text?: string
}

export class RexLocation {
  id: string
  text: string
}

export class RexUserLink {
  calendar: string
}

export class RexAccountUserRelated {
  user_groups: unknown[]
}

export class RexUser {
  id: string
  name: string
  first_name: string
  last_name: string
  email_address: string
}
