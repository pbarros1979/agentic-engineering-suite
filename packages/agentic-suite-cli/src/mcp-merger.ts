import path from "node:path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";

export interface McpServerConfig {
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

export async function mergeCursorMcp(
  targetDir: string,
  serverConfig: McpServerConfig = {
    command: "npx",
    args: ["-y", "@agentic-engineering-suite/mcp-server"],
  }
): Promise<string> {
  const cursorDir = path.join(targetDir, ".cursor");
  await fs.mkdir(cursorDir, { recursive: true });

  const mcpJsonPath = path.join(cursorDir, "mcp.json");
  let data: Record<string, any> = {};

  if (existsSync(mcpJsonPath)) {
    try {
      const raw = await fs.readFile(mcpJsonPath, "utf-8");
      data = JSON.parse(raw);
    } catch (err) {
      console.error(`[WARN] Não foi possível parsear .cursor/mcp.json existente:`, err);
      data = {};
    }
  }

  if (!data.mcpServers || typeof data.mcpServers !== "object") {
    data.mcpServers = {};
  }

  data.mcpServers["agentic-suite"] = serverConfig;

  await fs.writeFile(mcpJsonPath, JSON.stringify(data, null, 2) + "\n", "utf-8");
  return mcpJsonPath;
}

export async function mergeVsCodeMcp(
  targetDir: string,
  serverConfig: McpServerConfig = {
    command: "npx",
    args: ["-y", "@agentic-engineering-suite/mcp-server"],
  }
): Promise<string> {
  const vscodeDir = path.join(targetDir, ".vscode");
  await fs.mkdir(vscodeDir, { recursive: true });

  const settingsPath = path.join(vscodeDir, "settings.json");
  let data: Record<string, any> = {};

  if (existsSync(settingsPath)) {
    try {
      const raw = await fs.readFile(settingsPath, "utf-8");
      data = JSON.parse(raw);
    } catch {
      data = {};
    }
  }

  const key = "mcp.servers";
  if (!data[key] || typeof data[key] !== "object") {
    data[key] = {};
  }

  data[key]["agentic-suite"] = serverConfig;

  await fs.writeFile(settingsPath, JSON.stringify(data, null, 2) + "\n", "utf-8");
  return settingsPath;
}
