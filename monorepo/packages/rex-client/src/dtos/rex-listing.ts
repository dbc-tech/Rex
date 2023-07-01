import {
  RexListingSubCategory,
  RexPropertyCategory,
} from './rex-listing-categories'

export class RexListingProperty {
  property_category: RexPropertyCategory
  adr_unit_number: string
  adr_street_number: string
  adr_street_name: string
  adr_state_or_region: string
  adr_suburb_or_town: string
  adr_postcode: string
  adr_country: string
  attr_bedrooms: string
  attr_bathrooms: string
  attr_total_car_accom: string
}

export class RexListingImage {
  url: string
}

export class RexListingAgent {
  id: string
  name: string
  email_address: string
  phone_direct?: string
  phone_mobile: string
  position?: string
}

export class RexListingRelated {
  listing_subcategories: Array<RexListingSubCategory>
}

class RexAuthorityType {
  text: string
}

class RexLocation {
  id: string
}

class RexListingCategory {
  id: string
}

export class RexListing {
  id: number
  price_match: number
  location: RexLocation
  property: RexListingProperty
  listing_primary_image: RexListingImage
  listing_agent_1: RexListingAgent
  listing_agent_2?: RexListingAgent
  related: RexListingRelated
  authority_type: RexAuthorityType
  authority_date_expires: string
  authority_date_start: string
  system_listing_state: string
  system_publication_status: string
  listing_category: RexListingCategory
}
