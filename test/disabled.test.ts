import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs-extra'
import os from 'node:os'
import path from 'node:path'
import { readDisabled, writeDisabled, getDisabledPathFor } from '../src/core/disabled'
import { getSettingsPath } from '../src/core/config'

const tmpHome = path.join(os.tmpdir(), 'gcmcp-tests-home')
const settingsPath = path.join(tmpHome, '.gemini', 'settings.json')

function setHomeEnv(dir: string) {
  process.env.HOME = dir
  process.env.USERPROFILE = dir // Windows
}

describe('disabled list read/write', () => {
  beforeEach(async () => {
    await fs.remove(tmpHome)
    await fs.ensureDir(path.dirname(settingsPath))
    await fs.writeFile(settingsPath, JSON.stringify({ mcpServers: {} }), 'utf8')
    setHomeEnv(tmpHome)
    process.env.GEMINI_SETTINGS_PATH = settingsPath
  })
  afterEach(async () => {
    await fs.remove(tmpHome)
    delete process.env.HOME
    delete process.env.USERPROFILE
    delete process.env.GEMINI_SETTINGS_PATH
  })

  it('reads empty when not exists', async () => {
    const m = await readDisabled()
    expect(m).toEqual({})
  })

  it('writes and reads map', async () => {
    const p = getDisabledPathFor(getSettingsPath())
    await writeDisabled({ x: { transport: 'stdio', command: 't' } }, p)
    const m = await readDisabled(p)
    expect(Object.keys(m)).toEqual(['x'])
  })
})
