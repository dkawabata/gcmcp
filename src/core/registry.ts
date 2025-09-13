import fs from 'fs-extra'
import os from 'node:os'
import path from 'node:path'

export type RegistryItem = {
  id: string
  label?: string
  server: unknown
}

export function getRegistryDir(): string {
  return path.join(os.homedir(), '.config', 'gcmcp', 'servers')
}

export async function listRegistry(): Promise<RegistryItem[]> {
  const dir = getRegistryDir()
  const out: RegistryItem[] = []
  if (!(await fs.pathExists(dir))) return out
  const entries = await fs.readdir(dir)
  for (const file of entries) {
    if (!file.endsWith('.json')) continue
    const id = file.replace(/\.json$/, '')
    try {
      const raw = await fs.readFile(path.join(dir, file), 'utf8')
      const server = JSON.parse(raw) as unknown
      out.push({ id, server })
    } catch {
      // ignore broken file
    }
  }
  return out
}
