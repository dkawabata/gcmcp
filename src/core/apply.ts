import type { GeminiSettings } from './config'

export type ApplyMode = 'compose' | 'merge'

export function buildNextSettings(
  current: GeminiSettings,
  nextMcp: Record<string, unknown>,
  mode: ApplyMode,
): GeminiSettings {
  const base = { ...current }
  const cur = (current.mcpServers ?? {}) as Record<string, unknown>
  if (mode === 'compose') {
    base.mcpServers = { ...nextMcp }
  } else {
    base.mcpServers = { ...cur, ...nextMcp }
  }
  return base
}
