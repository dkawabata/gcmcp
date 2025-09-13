import type { GeminiSettings } from './config'
import type { McpServer } from './validate'

export type ApplyMode = 'compose' | 'merge'

export function buildNextSettings(
  current: GeminiSettings,
  nextMcp: Record<string, McpServer>,
  mode: ApplyMode,
): GeminiSettings {
  const base = { ...current }
  const cur = (current.mcpServers ?? {}) as Record<string, McpServer>
  if (mode === 'compose') {
    base.mcpServers = { ...nextMcp }
  } else {
    base.mcpServers = { ...cur, ...nextMcp }
  }
  return base
}
