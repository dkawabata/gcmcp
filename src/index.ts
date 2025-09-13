import { Command } from 'commander'
import { toggleCommand } from './commands/toggle'
import { lsCommand } from './commands/ls'
import { enableCommand } from './commands/enable'
import { disableCommand } from './commands/disable'
import { diffCommand } from './commands/diff'

const program = new Command()

program
  .name('gcmcp')
  .description('Interactive MCP servers switcher for Gemini CLI (~/.gemini/settings.json)')
  .version('0.1.0')

program
  .command('toggle')
  .description('Toggle mcpServers on/off with interactive checklist UI')
  .option('--mode <mode>', 'compose|merge (default: compose)', 'compose')
  .option('--dry-run', 'Show diff without writing changes', false)
  .action(async (opts) => {
    try { await toggleCommand(opts) } catch (e: unknown) { const err = e as Error; console.error(err?.message ?? e); process.exitCode = 1 }
  })

program
  .command('ls')
  .description('List current mcpServers')
  .option('--json', 'Output as JSON', false)
  .option('--all', 'Show both enabled and disabled', false)
  .option('--disabled', 'Show disabled only', false)
  .action(async (opts) => {
    try { await lsCommand(opts) } catch (e: unknown) { const err = e as Error; console.error(err?.message ?? e); process.exitCode = 1 }
  })

program
  .command('enable')
  .argument('<id>', 'server id')
  .option('--dry-run', 'Show diff without writing changes', false)
  .description('Enable specified server id from disabled list')
  .action(async (id: string, opts) => {
    try { await enableCommand(id, opts) } catch (e: unknown) { const err = e as Error; console.error(err?.message ?? e); process.exitCode = 1 }
  })

program
  .command('disable')
  .argument('<id>', 'server id')
  .option('--dry-run', 'Show diff without writing changes', false)
  .description('Move specified server id to disabled list')
  .action(async (id: string, opts) => {
    try { await disableCommand(id, opts) } catch (e: unknown) { const err = e as Error; console.error(err?.message ?? e); process.exitCode = 1 }
  })

program
  .command('diff')
  .description('Preview enable/disable changes')
  .option('--compose <ids>', 'Comma-separated ids to be enabled exclusively (compose mode)')
  .action(async (opts) => {
    try { await diffCommand(opts) } catch (e: unknown) { const err = e as Error; console.error(err?.message ?? e); process.exitCode = 1 }
  })

// デフォルト: toggle UI を起動
program.action(async () => {
  try { await toggleCommand({ mode: 'compose', dryRun: false }) } catch (e: unknown) { const err = e as Error; console.error(err?.message ?? e); process.exitCode = 1 }
})

program.parseAsync()
