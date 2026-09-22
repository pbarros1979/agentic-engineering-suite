import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import { mergeCursorMcp, mergeVsCodeMcp } from "../src/mcp-merger.js";

describe("MCP Safe JSON Merger Tests", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "mcp-merger-test-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("deve criar .cursor/mcp.json em projeto sem configuração pré-existente", async () => {
    const filePath = await mergeCursorMcp(tmpDir);
    const content = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(content);

    expect(json.mcpServers).toBeDefined();
    expect(json.mcpServers["agentic-suite"]).toBeDefined();
    expect(json.mcpServers["agentic-suite"].command).toBe("npx");
  });

  it("deve preservar servidores MCP pré-existentes de forma não-destrutiva", async () => {
    const cursorDir = path.join(tmpDir, ".cursor");
    await fs.mkdir(cursorDir, { recursive: true });

    const existingConfig = {
      mcpServers: {
        "existing-db-server": {
          command: "node",
          args: ["./db-server.js"],
        },
      },
      customOption: true,
    };
    await fs.writeFile(path.join(cursorDir, "mcp.json"), JSON.stringify(existingConfig), "utf-8");

    await mergeCursorMcp(tmpDir);

    const updated = JSON.parse(await fs.readFile(path.join(cursorDir, "mcp.json"), "utf-8"));
    expect(updated.customOption).toBe(true);
    expect(updated.mcpServers["existing-db-server"]).toBeDefined();
    expect(updated.mcpServers["existing-db-server"].command).toBe("node");
    expect(updated.mcpServers["agentic-suite"]).toBeDefined();
  });

  it("deve mesclar servidor no .vscode/settings.json", async () => {
    const filePath = await mergeVsCodeMcp(tmpDir);
    const content = JSON.parse(await fs.readFile(filePath, "utf-8"));
    expect(content["mcp.servers"]["agentic-suite"]).toBeDefined();
  });
});
