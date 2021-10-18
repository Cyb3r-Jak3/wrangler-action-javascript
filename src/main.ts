import * as core from '@actions/core'

import {install} from './install'
import {wrangler_run} from './wrangler'

export async function set_creds(): Promise<void> {
  const apiToken = core.getInput('apitoken')
  const email = core.getInput('email')
  const apiKey = core.getInput('apikey')

  if (apiToken !== '') {
    process.env['CF_API_TOKEN'] = apiToken
  } else if (apiKey !== '') {
    if (email === '') {
      throw new Error('Need email set when using global api key')
    }

    process.env['CF_EMAIL'] = email
    process.env['CF_API_KEY'] = apiKey
  } else {
    throw new Error('Need to have either an apiToken or apiKey with email set')
  }
}

export async function run(): Promise<void> {
  try {
    await set_creds()
    await install()
    await wrangler_run()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
