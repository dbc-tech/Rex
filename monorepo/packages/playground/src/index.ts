import { RexClient } from '@dbc-tech/rex-client'
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

const start = async () => {
  const items = await rex.getAccountUsers()
  for await (const item of items) {
    console.log(item)
  }
}

;(async () => {
  await start()
})()
