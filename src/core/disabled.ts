import fs from 'fs-extra'
import path from 'node:path'
import { getSettingsPath } from './config'

export type DisabledMap = Record<string, unknown>

export function getDisabledPathFor(settingsPath: string): string {
  return `${settingsPath}.disabled.json`
}

async function ensureDirFor(filePath: string) {
  await fs.ensureDir(path.dirname(filePath))
}

export async function readDisabled(filePath = getDisabledPathFor(getSettingsPath())): Promise<DisabledMap> {
  if (!(await fs.pathExists(filePath))) return {}
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    const json = JSON.parse(raw)
    if (!json || typeof json !== 'object') return {}
    return json as DisabledMap
  } catch {
    return {}
  }
}

export async function writeDisabled(map: DisabledMap, filePath = getDisabledPathFor(getSettingsPath())) {
  await ensureDirFor(filePath)
  await fs.writeFile(filePath, JSON.stringify(map, null, 2), 'utf8')
}
