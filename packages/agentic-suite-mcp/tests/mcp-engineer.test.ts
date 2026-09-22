import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import { ToolRegistry } from "../src/registry.js";
import { mcpEngineerModule } from "../src/modules/mcp-engineer/index.js";
import { safeExists, safeReadFile } from "../src/utils/safe-fs.js";

describe("MCP Engineer Module Tests", () => {
  let tmpDir: string;
  let registry: ToolRegistry;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "mcp-engineer-test-"));
    registry = new ToolRegistry();
    registry.registerModule(mcpEngineerModule);
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("deve fazer scaffolding completo de novo servidor MCP com mcp_scaffold_server", async () => {
    const res = await registry.executeTool(
      "mcp_scaffold_server",
      {
        serverName: "custom-tools",
        description: "Servidor MCP customizado",
      },
      { baseDir: tmpDir }
    );

    expect(res.isError).toBeFalsy();
    const serverDir = "extensions/custom-tools";
    expect(safeExists(tmpDir, `${serverDir}/package.json`)).toBe(true);
    expect(safeExists(tmpDir, `${serverDir}/tsconfig.json`)).toBe(true);
    expect(safeExists(tmpDir, `${serverDir}/src/index.ts`)).toBe(true);
    expect(safeExists(tmpDir, `${serverDir}/src/utils/safe-fs.ts`)).toBe(true);
    expect(safeExists(tmpDir, `${serverDir}/tests/server.test.ts`)).toBe(true);

    const indexContent = await safeReadFile(tmpDir, `${serverDir}/src/index.ts`);
    expect(indexContent).toContain("StdioServerTransport");
    expect(indexContent).toContain("isError: true");
    expect(indexContent).not.toContain("console.log(");
  });

  it("deve validar código MCP e reprovar console.log com mcp_validate_schema", async () => {
    const badCode = `
      import { Server } from "@modelcontextprotocol/sdk/server/index.js";
      console.log("Servidor iniciado!"); // VIOLAÇÃO CRÍTICA
    `;

    const res = await registry.executeTool(
      "mcp_validate_schema",
      { code: badCode },
      { baseDir: tmpDir }
    );

    expect(res.isError).toBe(true);
    expect(res.content[0].text).toContain("CRÍTICO: Uso detectado de 'console.log()'");
  });

  it("deve aprovar código MCP aderente com mcp_validate_schema", async () => {
    const goodCode = `
      import { Server } from "@modelcontextprotocol/sdk/server/index.js";
      import { z } from "zod";
      const schema = z.object({ id: z.string() });
      try {
        console.error("Log seguro");
      } catch {
        return { isError: true, content: [] };
      }
    `;

    const res = await registry.executeTool(
      "mcp_validate_schema",
      { code: goodCode },
      { baseDir: tmpDir }
    );

    expect(res.isError).toBeFalsy();
    expect(res.content[0].text).toContain("APROVADO");
  });

  it("deve identificar vulnerabilidades potenciais com mcp_audit_security", async () => {
    // Fazer scaffolding de um servidor para auditar
    await registry.executeTool(
      "mcp_scaffold_server",
      { serverName: "safe-server" },
      { baseDir: tmpDir }
    );

    const auditRes = await registry.executeTool(
      "mcp_audit_security",
      { targetDir: path.join(tmpDir, "extensions/safe-server") },
      { baseDir: tmpDir }
    );

    expect(auditRes.isError).toBeFalsy();
    expect(auditRes.content[0].text).toContain("Vulnerabilidades: 0 ALTA");
  });
});
