import * as core from '@actions/core'
import {install} from './install'

export async function set_creds(): Promise<void> {
  if (core.getInput('apitoken') !== '') {
    process.env['CF_API_TOKEN'] = core.getInput('apitoken')
  } else if (core.getInput('apikey') !== '') {
    if (core.getInput('email') === '') {
      throw new Error('Need email set when using global api key')
    }
    process.env['CF_API_KEY'] = core.getInput('apikey')
    process.env['CF_EMAIL'] = core.getInput('email')
  } else {
    throw new Error('Need to have either an apitoken or apikey with email set')
  }
}

export async function run(): Promise<void> {
  try {
    await set_creds()
    const wrangler_version = core.getInput('wranglerversion')
    await install(wrangler_version)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
