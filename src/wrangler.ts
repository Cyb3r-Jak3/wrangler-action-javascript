import * as core from '@actions/core'
import * as exec from '@actions/exec'

export async function wrangler_run(): Promise<void> {
  const publish = core.getBooleanInput('publish')
  if (!publish) {
    return
  }
  core.startGroup('Publishing')
  var command_line_args: string[] = []
  const environment = core.getInput('environment')
  if (environment !== '') {
    command_line_args.push('--env', environment)
  }
  const config = core.getInput('config')
  if (config !== '') {
    command_line_args.push('--config', config)
  }
  const publish_output = await exec.exec(
    'wrangler',
    ['publish', ...command_line_args],
    {
      ignoreReturnCode: true
    }
  )

  if (publish_output !== 0) {
    throw new Error('Publish command did not complete successfully')
  }
  core.endGroup()

  const secrets = core.getMultilineInput('secrets')
  if (secrets.length !== 0) {
    core.startGroup('Setting Secrets')
    const fail_on_missing_secret = core.getBooleanInput(
      'fail_on_missing_secret'
    )
    for (const secret of secrets) {
      if (process.env[secret] === undefined && fail_on_missing_secret) {
        throw new Error(`Secret '${secret}' wanted and not set`)
      }
      const secret_output = await exec.getExecOutput(
        `echo ${process.env[secret]} | wrangler`,
        ['secret', 'put', secret, environment],
        {
          ignoreReturnCode: true
        }
      )
      if (secret_output.exitCode !== 0) {
        throw new Error(
          `Error setting secret '${secret}': ${secret_output.stdout}, ${secret_output.stderr}`
        )
      }
    }
    core.endGroup()
  }
}
