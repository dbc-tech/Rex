import {
  RexAccountUser,
  RexClient,
  RexSearchCriteria,
} from '@dbc-tech/rex-client'
import * as dotenv from 'dotenv'

dotenv.config()

const rex = new RexClient({
  baseUrl: process.env['REX_BASE_URL'],
  email: process.env['REX_EMAIL'],
  password: process.env['REX_PASSWORD'],
  customHeaders: {
    'X-App-Identifier': process.env['REX_APP_IDENTIFIER'],
  },
  defaultLoggerOptions: {
    level: 'debug',
  },
})

const getAccountUsers = async () => {
  const result = await rex.getAccountUsers()
  for await (const item of result) {
    console.log(item)
  }
}

const getListings = async () => {
  const searchCriteria: RexSearchCriteria = {
    extra_options: {
      extra_fields: ['related.listing_subcategories', 'core_attributes'],
    },
  }
  const result = await rex.getListings(searchCriteria)
  for await (const item of result) {
    console.log(item)
    console.log(item.related?.listing_subcategories)
  }
}

const getFeedbacks = async () => {
  const searchCriteria: RexSearchCriteria = {
    criteria: [
      {
        name: 'related_listing.property.adr_state_or_region',
        value: 'QLD',
      },
      {
        name: 'related_listing.listing.listing_category_id',
        value: 'residential_sale',
      },
      {
        name: 'related_listing.listing.authority_type_id',
        value: [
          'setsale',
          'sale',
          'other',
          'exclusive',
          'sole',
          'multilist',
          'conjunctional',
          'open',
        ],
      },
      {
        name: 'feedback_type_id',
        value: ['inspection', 'ofi'],
      },
    ],
    extra_options: {
      extra_fields: ['related.listing_subcategories'],
    },
  }

  const result = await rex.getFeedbacks(searchCriteria)
  for await (const item of result) {
    console.log(item)
    console.log(item.related)
    if (item.related.feedback_contacts) {
      for (const feedback_contact of item.related.feedback_contacts) {
        console.log(feedback_contact)
      }
    }
  }
}

const getCustomFieldDefinition = async () => {
  const result = await rex.getCustomFieldDefinition('listings', false)
  console.log(result)
  const groups = result.tabs[0].groups
  const fields = groups[0].fields
  console.log(fields)
}

const createTab = async () => {
  const result = await rex.createTab('listings', 'Test')
  console.log(result)
}

const createGroup = async () => {
  const result = await rex.createGroup('6987', 'Awesome Group')
  console.log(result)
}

const createField = async () => {
  const result = await rex.createField(
    '6270',
    'https://awesome.com',
    'text',
    'url',
  )
  console.log(result)
}

const getFieldValues = async () => {
  const result = await rex.getFieldValues('Listings', '3285032')
  console.log(result)
  if (!result['Test'] || result['Test'] === 'https://') {
    console.log('create')
    await createFieldValue()
  } else {
    console.log('exists')
  }
}

const createFieldValue = async () => {
  const result = await rex.createFieldValue(
    'Listings',
    '3285032',
    'Test',
    'https://example.com/',
  )
  console.log(result)
}

// eslint-disable-next-line promise/catch-or-return
createField().then(console.log)
