import { z } from 'zod'

export const StdioServer = z.object({
  transport: z.literal('stdio'),
  command: z.string(),
  args: z.array(z.string()).optional(),
  env: z.record(z.string()).optional(),
})

export const SseServer = z.object({
  transport: z.literal('sse'),
  url: z.string(),
  headers: z.record(z.string()).optional(),
})

export const WsServer = z.object({
  transport: z.literal('websocket'),
  url: z.string(),
  headers: z.record(z.string()).optional(),
})

// Fallback: allow unknown/custom transports to pass-through
export const GenericServer = z
  .object({ transport: z.string() })
  .catchall(z.any())

export const McpServer = z.union([StdioServer, SseServer, WsServer, GenericServer])

export const GeminiSettingsSchema = z
  .object({
    // Accept any shape per server; tool acts as pass-through
    mcpServers: z.record(z.unknown()).default({}),
  })
  .strip()
  .catchall(z.unknown())

export type McpServer = z.infer<typeof McpServer>

export function validateSettings(input: unknown) {
  return GeminiSettingsSchema.parse(input)
}
