import { RexClient } from '@dbc-tech/rex-client'
import got from 'got-cjs'
//import dotenv from 'dotenv'

//dotenv.config()

// Having to hard-code errors due to issue with ts-node-dev and dotenv
// Compilation error in /home/neil/code/dbc/Rex/monorepo/apps/playground/src/index.ts
// compiler.js:255
// [ERROR] 21:00:40 ⨯ Unable to compile TypeScript:
// monorepo/apps/playground/src/index.ts(2,8): error TS1192: Module '"/home/neil/code/dbc/Rex/monorepo/node_modules/dotenv/lib/main"' has no default export.
const rex = new RexClient({
  baseUrl: 'https://api.rexsoftware.com/v1/rex', // process.env['REX_BASE_URL'],
  email: 'mihir.patil@deepbluecompany.com.au', // process.env['REX_EMAIL'],
  password: 'Temp@123', // process.env['REX_PASSWORD'],
  customHeaders: {
    'X-App-Identifier': 'Integration:Offertoown',
  },
})

const start = async () => {
  // const response: any = await got
  //   .post('https://api.rexsoftware.com/v1/rex/Authentication/login', {
  //     retry: {
  //       limit: 3,
  //     },
  //     headers: {
  //       'X-App-Identifier': 'Integration:Offertoown',
  //     },
  //     json: {
  //       email: 'mihir.patil@deepbluecompany.com.au',
  //       password: 'Temp@123',
  //     },
  //   })
  //   .json()

  // console.log(response)

  const response = await rex.GetAccountUsers()
  for await (const agent of response) {
    console.log(agent)
  }
}

;(async () => {
  await start()
})()
