import { RexClient } from '@dbc-tech/rex-client'
import dotenv from 'dotenv'

dotenv.config()

const rex = new RexClient({
  baseUrl: process.env['REX_BASE_URL'],
  email: process.env['REX_EMAIL'],
  password: process.env['REX_PASSWORD'],
  customHeaders: {
    'X-App-Identifier': process.env['REX_APP_IDENTIFIER'],
  },
})

const start = async () => {
  const accountUsers = await rex.GetAccountUsers()
  for await (const user of accountUsers) {
    console.log(user)
  }
}

;(async () => {
  await start()
})()
