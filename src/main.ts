import * as core from '@actions/core'
import * as exec from '@actions/exec'

import {install} from './install'

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
    const wrangler_version = core.getInput('wranglerversion')
    await install(wrangler_version)
    core.saveState('isPost', true)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function logout(): Promise<void> {
  const output = await exec.getExecOutput('wrangler', ['logout'])
  if (output.exitCode !== 0) {
    core.setFailed(`Error logging out: ${output.stdout}, ${output.stderr}`)
  }
}

if (!!process.env['STATE_isPost']) {
  run()
} else {
  logout()
}
