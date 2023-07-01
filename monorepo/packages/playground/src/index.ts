import { RexClient } from '@dbc-tech/rex-client'
import dotenv from 'dotenv'

dotenv.config()

const rex = new RexClient({
  baseUrl: process.env['REX_BASE_URL'],
  email: process.env['REX_EMAIL'],
  password: process.env['REX_PASSWORD'],
  customHeaders: {
    'X-App-Identifier': 'Integration:Offertoown',
  },
})

const start = async () => {
  const response = await rex.GetAccountUsers()
  for await (const agent of response) {
    console.log(agent)
  }
}

;(async () => {
  await start()
})()
