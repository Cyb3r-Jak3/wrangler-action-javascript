import * as core from '@actions/core'

import * as exec from '@actions/exec'

export async function install(version: string): Promise<void> {
  core.startGroup('Installing wrangler')

  if (version === '') {
    version = 'latest'
  }
  core.debug(`Select wrangler version ${version}`)
  const run_install = await exec.getExecOutput(
    'npm',
    ['install', `@cloudflare/wrangler@${version}`],
    {
      ignoreReturnCode: true
    }
  )
  core.endGroup()
  if (run_install.exitCode !== 0) {
    throw new Error(
      `Error installing wrangler: ${run_install.stdout}, ${run_install.stderr}`
    )
  }
}
