import chalk from 'chalk'
import { readSettings } from '../core/config'
import { readDisabled } from '../core/disabled'

export async function lsCommand(opts: { json?: boolean; all?: boolean; disabled?: boolean }) {
  const settings = await readSettings()
  const disabled = await readDisabled()
  const enabledIds = Object.keys(settings.mcpServers ?? {})
  const disabledIds = Object.keys(disabled)

  const showEnabled = !opts.disabled
  const showDisabled = !!opts.disabled || !!opts.all

  if (opts.json) {
    console.log(
      JSON.stringify(
        {
          enabled: enabledIds,
          disabled: disabledIds,
        },
        null,
        2,
      ),
    )
    return
  }

  if (showEnabled) {
    if (enabledIds.length === 0) console.log(chalk.yellow('No enabled MCP servers'))
    else {
      console.log(chalk.cyan('Enabled MCP servers:'))
      for (const id of enabledIds) console.log('  -', chalk.green(id))
    }
  }
  if (showDisabled) {
    if (disabledIds.length === 0) console.log(chalk.gray('No disabled MCP servers'))
    else {
      console.log(chalk.cyan('Disabled MCP servers:'))
      for (const id of disabledIds) console.log('  -', chalk.gray(id))
    }
  }
}
