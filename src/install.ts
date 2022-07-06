import * as core from '@actions/core'

import * as exec from '@actions/exec'

export async function install(): Promise<void> {
  core.startGroup('Installing Wrangler')
  var version = core.getInput('wranglerversion')

  if (version === '') {
    version = 'latest'
  }
  const run_install = await exec.getExecOutput(
    'npm',
    ['install', '-g', `wrangler@${version}`],
    {
      ignoreReturnCode: true
    }
  )
  if (run_install.exitCode !== 0) {
    throw new Error(
      `Error installing wrangler: ${run_install.stdout}, ${run_install.stderr}`
    )
  }
  core.endGroup()
}
