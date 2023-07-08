export class RexPropertyCategory {
  id: string
  text: string
}

export class RexPropertySubCategory {
  id: string
  text: string
}

export class RexListingSubCategory {
  priority: number
  id: number
  subcategory: RexPropertySubCategory
}
