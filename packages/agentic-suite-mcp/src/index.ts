#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer } from "./server.js";

async function main() {
  const { server } = createMcpServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error("[INFO] @agentic-engineering-suite/mcp-server iniciado com sucesso via StdioServerTransport.");
}

main().catch((err) => {
  console.error("[FATAL] Erro ao iniciar @agentic-engineering-suite/mcp-server:", err);
  process.exit(1);
});
