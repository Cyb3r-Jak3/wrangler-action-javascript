import * as core from '@actions/core'
import * as exec from '@actions/exec'

export async function wrangler_run(): Promise<void> {
  const publish = core.getBooleanInput('publish')
  if (!publish) {
    return
  }
  var environment = core.getInput('environment')
  if (environment !== '') {
    environment = `-e ${environment}`
  }
  core.startGroup("Publishing")
  const publish_output = await exec.exec('wrangler', ['publish'], {
    ignoreReturnCode: true
  })
  if (publish_output !== 0) {
    throw new Error('Publish command did not complete successfully')
  }
  core.endGroup()
  const secrets = core.getMultilineInput('secrets')
  if (secrets.length !== 0) {
    core.startGroup("Setting Secrets")
    const fail_on_missing_secret = core.getBooleanInput('fail_on_missing_secret')
    secrets.forEach(async element => {
      if (process.env.element === undefined && fail_on_missing_secret) {
        throw new Error(`Secret '${element}' wanted and not set`)
      }
      const secret_output = await exec.exec(
        `echo ${process.env.element} | wrangler`,
        ['secret', 'put', element, environment]
      )
      if (secret_output !== 0) {
        throw new Error('Error setting secret: ' + element)
      }
    })
    core.endGroup()
  }
}
