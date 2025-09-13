import chalk from 'chalk'
import { backupSettings, readSettings, writeSettings, getSettingsPath } from '../core/config'
import { readDisabled, writeDisabled, getDisabledPathFor } from '../core/disabled'
import type { McpServer } from '../core/validate'

export async function disableCommand(id: string, opts: { dryRun?: boolean }) {
  const settingsPath = getSettingsPath()
  const disabledPath = getDisabledPathFor(settingsPath)
  const settings = await readSettings(settingsPath)
  const current = settings.mcpServers ?? {}
  const disabled = await readDisabled(disabledPath)

  if (!(id in current)) {
    console.log(chalk.yellow(`Not found in enabled list: ${id}`))
    return
  }

  if (opts.dryRun) {
    console.log(chalk.cyan('dry-run: no changes will be written'))
    console.log(chalk.yellow(`Disable: ${id}`))
    return
  }

  const server: McpServer = current[id]
  const next = { ...current }
  delete next[id]
  const nextDisabled = { ...disabled, [id]: server }
  const backup = await backupSettings(settingsPath)
  await writeSettings({ ...settings, mcpServers: next }, settingsPath)
  await writeDisabled(nextDisabled, disabledPath)
  console.log(chalk.green(`Disabled: ${id}`))
  if (backup) console.log(chalk.gray('Backup:'), backup)
}
