import chalk from 'chalk'
import { backupSettings, readSettings, writeSettings, getSettingsPath } from '../core/config'
import { buildNextSettings, type ApplyMode } from '../core/apply'
import { promptToggle } from '../ui/prompt'
import { readDisabled, writeDisabled, getDisabledPathFor } from '../core/disabled'

export async function toggleCommand(opts: { mode?: ApplyMode; dryRun?: boolean }) {
  const mode: ApplyMode = (opts.mode as ApplyMode) ?? 'compose'
  const dryRun = !!opts.dryRun

  const settingsPath = getSettingsPath()
  const settings = await readSettings(settingsPath)
  const current = settings.mcpServers ?? {}
  const disabledPath = getDisabledPathFor(settingsPath)
  const disabled = await readDisabled(disabledPath)

  const unionIds = Array.from(new Set([...Object.keys(current), ...Object.keys(disabled)]))

  if (unionIds.length === 0) {
    console.log(chalk.yellow('No MCP server definitions found. Please add entries to settings.json.'))
    return
  }

  const selected = await promptToggle({
    title: 'Select MCP servers to enable (Space: toggle / Enter: apply)',
    choices: unionIds.map((id) => ({ name: id, value: id, checked: id in current })),
  })

  let finalEnabled: Record<string, unknown> = {}
  const finalDisabled: Record<string, unknown> = { ...disabled }

  if (mode === 'compose') {
    // Only selected IDs remain enabled; others move to disabled
    for (const id of unionIds) {
      const isSelected = selected.includes(id)
      if (isSelected) {
        if (id in current) finalEnabled[id] = current[id]
        else if (id in disabled) {
          finalEnabled[id] = disabled[id]
          delete finalDisabled[id]
        }
      } else if (id in current) {
        finalDisabled[id] = current[id]
      }
    }
  } else {
    // merge: keep current enabled as-is; additionally enable any selected from disabled
    finalEnabled = { ...current }
    for (const id of selected) {
      if (!(id in finalEnabled) && id in disabled) {
        finalEnabled[id] = disabled[id]
        delete finalDisabled[id]
      }
    }
  }

  const nextSettings = buildNextSettings(settings, finalEnabled, 'compose')

  if (dryRun) {
    const willEnable = Object.keys(finalEnabled).filter((id) => !(id in current))
    const willDisable = Object.keys(current).filter((id) => !(id in finalEnabled))
    console.log(chalk.cyan('dry-run: no changes will be written'))
    if (willEnable.length) {
      console.log(chalk.green('Enable:'))
      for (const id of willEnable) console.log('  +', id)
    }
    if (willDisable.length) {
      console.log(chalk.yellow('Disable:'))
      for (const id of willDisable) console.log('  -', id)
    }
    return
  }

  const backup = await backupSettings(settingsPath)
  await writeSettings(nextSettings, settingsPath)
  await writeDisabled(finalDisabled, disabledPath)
  console.log(chalk.green('Updated:'), chalk.bold(settingsPath))
  if (backup) console.log(chalk.gray('Backup:'), backup)
}
