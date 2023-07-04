import { RexAccountUser, RexClient } from '@dbc-tech/rex-client'
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
  const agentAccounts: RexAccountUser[] = []
  for await (const item of result) {
    agentAccounts.push(item)
  }

  return agentAccounts
}

const getListings = async () => {
  const result = await rex.getListings()
  for await (const item of result) {
    console.log(item)
  }
}

const getFeedbacks = async () => {
  const result = await rex.getFeedbacks()
  for await (const item of result) {
    console.log(item)
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
  const result = await rex.createTab('listings', 'Offer to Own')
  console.log(result)
}

const getFieldValues = async () => {
  const result = await rex.getFieldValues('Listings', '3285032')
  console.log(result)
  if (
    !result['Offer to Own.Offer to Own Links.Buyer Link'] ||
    result['Offer to Own.Offer to Own Links.Buyer Link'] === 'https://'
  ) {
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
    'Offer to Own.Offer to Own Links.Buyer Link',
    'https://example.com/',
  )
  console.log(result)
}

// eslint-disable-next-line promise/catch-or-return
getCustomFieldDefinition().then(console.log)
