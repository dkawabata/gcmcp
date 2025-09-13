import chalk from 'chalk'
import { backupSettings, readSettings, writeSettings, getSettingsPath } from '../core/config'
import { readDisabled, writeDisabled, getDisabledPathFor } from '../core/disabled'

export async function enableCommand(id: string, opts: { dryRun?: boolean }) {
  const settingsPath = getSettingsPath()
  const disabledPath = getDisabledPathFor(settingsPath)
  const settings = await readSettings(settingsPath)
  const disabled = await readDisabled(disabledPath)
  const current = settings.mcpServers ?? {}

  if (!(id in disabled)) {
    console.log(chalk.yellow(`Not found in disabled list: ${id}`))
    return
  }

  if (opts.dryRun) {
    console.log(chalk.cyan('dry-run: no changes will be written'))
    console.log(chalk.green(`Enable: ${id}`))
    return
  }

  const server = disabled[id]
  delete disabled[id]
  const next = { ...current, [id]: server }
  const backup = await backupSettings(settingsPath)
  await writeSettings({ ...settings, mcpServers: next }, settingsPath)
  await writeDisabled(disabled, disabledPath)
  console.log(chalk.green(`Enabled: ${id}`))
  if (backup) console.log(chalk.gray('Backup:'), backup)
}
