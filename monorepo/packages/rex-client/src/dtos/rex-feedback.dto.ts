class RexContact {
  id: string
  name_first: string
  name_last: string
  phone_number: string
}

class RexFeedbackContact {
  id: string
  contact: RexContact
}

class RexFeedbackRelated {
  feedback_contacts: Array<RexFeedbackContact>
}

class RexFeedbackType {
  id: string
  text: string
}

class RexFeedbackListing {
  id: number
}

export class RexFeedback {
  id: number
  date_of: string
  listing: RexFeedbackListing
  feedback_type: RexFeedbackType
  related: RexFeedbackRelated
}
