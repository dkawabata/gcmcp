import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs-extra'
import os from 'node:os'
import path from 'node:path'
import { readSettings, writeSettings, backupSettings } from '../src/core/config'

const tmpRoot = path.join(os.tmpdir(), 'gcmcp-tests-config')
const settingsPath = path.join(tmpRoot, '.gemini', 'settings.json')

function setEnvSettings(p: string) {
  process.env.GEMINI_SETTINGS_PATH = p
}

describe('config read/write/backup', () => {
  beforeEach(async () => {
    await fs.remove(tmpRoot)
    await fs.ensureDir(path.dirname(settingsPath))
    setEnvSettings(settingsPath)
  })
  afterEach(async () => {
    delete process.env.GEMINI_SETTINGS_PATH
    await fs.remove(tmpRoot)
  })

  it('returns empty when file does not exist', async () => {
    const s = await readSettings()
    expect(s.mcpServers).toEqual({})
  })

  it('writes and reads settings', async () => {
    await writeSettings({ mcpServers: { a: { transport: 'stdio', command: 'x' } } }, settingsPath)
    const s = await readSettings()
    expect(Object.keys(s.mcpServers ?? {})).toEqual(['a'])
  })

  it('creates a backup when file exists', async () => {
    await writeSettings({ mcpServers: {} }, settingsPath)
    const b = await backupSettings(settingsPath)
    expect(b).toBeTruthy()
    expect(await fs.pathExists(b!)).toBe(true)
  })
})

