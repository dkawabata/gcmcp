import { describe, it, expect } from 'vitest'
import { buildNextSettings } from '../src/core/apply'

describe('apply compose/merge', () => {
  it('compose replaces mcpServers entirely', () => {
    const cur = { mcpServers: { a: 1, b: 2 } }
    const next = buildNextSettings(cur as any, { b: 3, c: 4 }, 'compose')
    expect(Object.keys(next.mcpServers as any)).toEqual(['b', 'c'])
  })
  it('merge adds/overwrites keys', () => {
    const cur = { mcpServers: { a: 1, b: 2 } }
    const next = buildNextSettings(cur as any, { b: 3, c: 4 }, 'merge')
    expect(next.mcpServers).toEqual({ a: 1, b: 3, c: 4 })
  })
})

