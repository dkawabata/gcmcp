import chalk from 'chalk'
import { readSettings } from '../core/config'
import { readDisabled } from '../core/disabled'

export async function diffCommand(opts: { compose?: string }) {
  const settings = await readSettings()
  const disabled = await readDisabled()
  const current = settings.mcpServers ?? {}

  const enabledIdsNow = new Set(Object.keys(current))

  if (!opts.compose) {
    console.log(chalk.cyan('現在の状態:'))
    console.log('  有効:', [...enabledIdsNow].join(', ') || '-')
    console.log('  無効:', Object.keys(disabled).join(', ') || '-')
    console.log(chalk.gray('ヒント: --compose id1,id2 で「それらだけを有効」にした場合の差分を表示します。'))
    return
  }

  const composeIds = opts.compose.split(',').map((s: string) => s.trim()).filter(Boolean)
  const composeSet = new Set(composeIds)

  const willEnable = composeIds.filter((id) => !enabledIdsNow.has(id) && (id in disabled))
  const willDisable = [...enabledIdsNow].filter((id) => !composeSet.has(id))

  if (willEnable.length === 0 && willDisable.length === 0) {
    console.log(chalk.gray('差分はありません'))
    return
  }
  if (willEnable.length) {
    console.log(chalk.green('有効化:'))
    for (const id of willEnable) console.log('  +', id)
  }
  if (willDisable.length) {
    console.log(chalk.yellow('無効化:'))
    for (const id of willDisable) console.log('  -', id)
  }
}

