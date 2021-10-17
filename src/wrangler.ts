import * as core from '@actions/core'
import * as exec from '@actions/exec'

export async function wrangler_run(): Promise<void> {
  const publish = core.getBooleanInput('publish')
  if (!publish) {
    return
  }
  var environment = core.getInput('environment')
  const secrets = core.getMultilineInput('secrets')
  const fail_on_missing_secret = core.getBooleanInput('fail_on_missing_secret')
  if (environment !== '') {
    environment = `-e ${environment}`
  }
  //   const publish_output = await exec.exec('wrangler', ['publish', ((environment !== '' ? environment : null ) ], {ignoreReturnCode: true})
  const publish_output = await exec.exec(
    `wrangler publish ${environment !== '' ? environment : null}`,
    undefined,
    {ignoreReturnCode: true}
  )
  if (publish_output !== 0) {
    throw new Error('Publish command did not complete successfully')
  }
  secrets.forEach(async element => {
    const secret_output = await exec.exec(
      `echo ${process.env[element]} | wrangler`,
      ['secret', 'put', element, environment]
    )
    if (secret_output !== 0 && fail_on_missing_secret) {
      throw new Error('Error setting secret: ' + element)
    }
  })
}
