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

export const McpServer = z.union([StdioServer, SseServer, WsServer])

export const GeminiSettingsSchema = z.object({
  mcpServers: z.record(McpServer).default({}),
}).strip().catchall(z.any())

export type McpServer = z.infer<typeof McpServer>

export function validateSettings(input: unknown) {
  return GeminiSettingsSchema.parse(input)
}

