export class RexPropertyCategory {
  id: string
  text: string
}

export class RexPropertySubCategory {
  id: string
  text: string
}

export class RexListingSubCategory {
  priority: string
  id: string
  subcategory: RexPropertySubCategory
}
