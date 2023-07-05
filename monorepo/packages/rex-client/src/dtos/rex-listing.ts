import { RexUser } from './rex-account-user'
import { RexId } from './rex-id'
import {
  RexListingSubCategory,
  RexPropertyCategory,
} from './rex-listing-categories'

export class RexListingProperty {
  system_search_key: string
  business_name: string
  adr_longitude: string
  adr_latitude: string
  property_category: RexPropertyCategory
  adr_unit_number: string
  adr_street_number: string
  adr_street_name: string
  adr_state_or_region: string
  adr_suburb_or_town: string
  adr_postcode: string
  adr_country: string
  adr_locality: string
  adr_estate_name: string
  adr_estate_stage: string
  adr_building: string
  attr_bedrooms?: string
  attr_bathrooms?: string
  attr_total_car_accom?: string
  system_owner_user: RexUser
  property_image: RexPropertyImage
  etag: string
  id: string
}

export class RexListingImage {
  uri: string
  url: string
  thumbs: Record<string, unknown[]>
}

export class RexPropertyImage {
  uri: string
  url: string
  thumbs: unknown[]
}

export class RexListingAgent {
  id: string
  name: string
  first_name: string
  last_name: string
  email_address: string
  phone_direct?: string
  phone_mobile: string
  position?: string
  is_account_user: string
  profile_image: unknown
}

export class RexListingRelated {
  listing_subcategories: Array<RexListingSubCategory>
}

export class RexAuthorityType extends RexId {}

export class RexLocation extends RexId {}

export class RexListingCategory extends RexId {}

export class RexTenancyType extends RexId {}

export class RexListing {
  id: number
  location: RexLocation
  property: RexListingProperty
  listing_primary_image: RexListingImage
  listing_agent_1: RexListingAgent
  listing_agent_2?: RexListingAgent
  related?: RexListingRelated
  authority_type?: RexAuthorityType
  authority_date_expires?: string
  authority_date_start?: string
  system_listing_state: string
  system_publication_status?: string
  listing_category: RexListingCategory
  listing_category_name?: string
  listing_subcategory_1?: unknown
  system_ctime?: number
  system_modtime?: number
  system_publication_time?: number
  system_publication_user_id?: number
  system_overpayment_balance?: unknown
  system_has_preupload_errors?: unknown
  authority_duration_days?: unknown
  price_advertise_as?: string
  price_est_rent_pw?: unknown
  price_rent?: unknown
  price_match?: number
  price_match_sale?: number
  price_match_rent_pa_inc_tax?: unknown
  price_bond?: unknown
  price_rent_per_m2?: unknown
  available_from_date?: string
  inspection_alarm_code?: string
  inspection_notes?: string
  outgoings_annual?: string
  outgoings_rent_is_plus?: string
  meta_highlight_1?: string
  meta_highlight_2?: string
  meta_highlight_3?: string
  meta_other_features?: string
  feedback_offer_level?: string
  feedback_price_rank?: string
  feedback_notes?: string
  legal_prop_lot?: string
  legal_prop_subdivision?: string
  legal_prop_address?: string
  legal_prop_titleref?: string
  legal_vendor_name?: string
  legal_vendor_residence?: string
  state_value_price?: string
  state_value_price_rent_period_id?: string
  state_value_deposit?: string
  state_date?: string
  state_reason_id?: string
  state_reason_note?: string
  state_lost_agency_id?: string
  state_change_timestamp?: string
  inbound_unique_id?: string
  inbound_last_update?: string
  publish_to_portals?: boolean
  publish_to_automatch?: boolean
  publish_to_external?: boolean
  publish_to_general?: boolean
  status_is_not_for_sale?: string
  baseline_price?: string
  parent_listing_id?: string
  new_home?: string
  image_cycling_delay_in_hours?: string
  image_cycling_delayed_until?: string
  comm_amount_fixed?: string
  comm_amount_percentage?: string
  comm_is_inc_tax?: string
  comm_est_based_on_service?: string
  comm_est_based_on_object_id?: string
  comm_est_based_on_amount?: string
  comm_est_amount_net_of_tax?: string
  comm_est_amount_inc_tax?: string
  comm_base_amount_override?: string
  is_multiple?: string
  price_match_max?: string
  price_match_max_sale?: string
  price_rent_max?: string
  price_rent_max_per_m2?: string
  price_match_rent_max_pa_inc_tax?: string
  let_agreed?: string
  permit_number?: string
  etag?: string
  system_owner_user: RexUser
  system_modified_user?: RexUser
  system_created_user?: RexUser
  security_user_rights?: string[]
  under_contract?: boolean
  hold_status?: unknown
  contract_status?: unknown
  project_listing_status?: unknown
  legal_solicitor?: null
  legal_solicitor_contact?: null
  project_stage?: null
  exclusivity?: null
  inspection_type?: null
  price_rent_period?: null
  price_rent_tax?: null
  comm_structure?: null
  comm_amount_model?: null
  tenancy_type?: RexTenancyType
  lead_auto_response_template?: null
}
