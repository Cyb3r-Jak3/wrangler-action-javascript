import * as exec from '@actions/exec'
import * as core from '@actions/core'

async function logout(): Promise<void> {
  const output = await exec.getExecOutput('wrangler', ['logout'])
  if (output.exitCode !== 0) {
    core.setFailed(`Error logging out: ${output.stdout}, ${output.stderr}`)
  }
}

logout()
