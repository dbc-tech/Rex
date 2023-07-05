import { RexUser } from './rex-account-user'
import { RexId } from './rex-id'
import { RexListing, RexListingAgent } from './rex-listing'

export class RexContact {
  id: string
  system_record_state: string
  system_ctime: string
  system_modtime: string
  name: string
  email_address: string
  phone_number: string
  fax_number: string
  is_dnd: unknown
  type: string
  last_contacted_date: string
  name_first: string
  name_last: string
  address_postal: unknown
  address: unknown
  interest_level: unknown
  marketing_birthday: unknown
  marketing_enquiry_source: unknown
  marketing_gender: unknown
  marketing_postcode: unknown
  name_legal: unknown
  name_salutation: unknown
  name_addressee: unknown
  system_owner_user: RexUser
  contact_image: unknown
  marketing_enquiry_method: unknown
  etag: string
}

export class RexFeedbackContact {
  id: string
  contact: RexContact
}

export class RexFeedbackRelated {
  feedback_contacts: Array<RexFeedbackContact>
}

export class RexFeedbackType {
  id: string
  text: string
}

export class RexFeedback {
  id: number
  date_of: string
  listing: RexListing
  feedback_type: RexFeedbackType
  related: RexFeedbackRelated
  system_record_state: string
  system_ctime: number
  system_modtime: number
  system_approval_status_time: number
  date_time_start: string
  date_time_finish: string
  date_finish: string
  amount_of: unknown
  number_of_people: string
  price_previous_match: unknown
  price_previous_advertising: unknown
  price_new_match: unknown
  price_new_advertising: unknown
  has_individual_feedback: boolean
  etag: string
  system_modified_user: RexUser
  system_created_user: RexUser
  project: unknown
  project_stage: unknown
  agent: RexListingAgent
  system_approval_status_user: RexListingAgent
  enquiry_source: unknown
  system_approval_status: RexId
  interest_level: unknown
  security_user_rights: string[]
  note: string
  portal_activity: {
    manual: unknown[]
    auto: unknown[]
  }
}
