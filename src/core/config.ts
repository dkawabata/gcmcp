import fs from 'fs-extra'
import os from 'node:os'
import path from 'node:path'
import { validateSettings } from './validate'

export const DEFAULT_SETTINGS_PATH = path.join(os.homedir(), '.gemini', 'settings.json')
export const SETTINGS_ENV = 'GEMINI_SETTINGS_PATH'

export type GeminiSettings = {
  mcpServers?: Record<string, unknown>
  [k: string]: unknown
}

export function getSettingsPath(): string {
  const override = process.env[SETTINGS_ENV]
  return override && override.trim().length > 0 ? override : DEFAULT_SETTINGS_PATH
}

export async function readSettings(filePath = getSettingsPath()): Promise<GeminiSettings> {
  if (!(await fs.pathExists(filePath))) return { mcpServers: {} }
  const raw = await fs.readFile(filePath, 'utf8')
  try {
    // Tolerate BOM and empty files
    const cleaned = raw.replace(/^\uFEFF/, '')
    if (cleaned.trim().length === 0) return { mcpServers: {} }
    const json = JSON.parse(cleaned) as unknown
    const parsed = validateSettings(json)
    return parsed as GeminiSettings
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    throw new Error(`Failed to parse JSON settings file: ${filePath} (${msg})`)
  }
}

export async function ensureDirFor(filePath: string) {
  await fs.ensureDir(path.dirname(filePath))
}

export async function backupSettings(filePath = getSettingsPath()): Promise<string | null> {
  if (!(await fs.pathExists(filePath))) return null
  const backupPath = `${filePath}.gcmcp.bak`
  await fs.copy(filePath, backupPath)
  return backupPath
}

export async function writeSettings(settings: GeminiSettings, filePath = getSettingsPath()) {
  await ensureDirFor(filePath)
  const text = JSON.stringify(settings, null, 2) + '\n'
  await fs.writeFile(filePath, text, 'utf8')
}
