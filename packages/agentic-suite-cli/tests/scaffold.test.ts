import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import { scaffoldAgents } from "../src/scaffold.js";
import { detectEnvironment } from "../src/detect.js";

describe("CLI Scaffolding E2E Tests", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "cli-scaffold-test-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("Full Suite E2E: deve inicializar com todos os agentes e assistentes", async () => {
    const res = await scaffoldAgents({
      targetDir: tmpDir,
      selectedAgentIds: ["spec-maestro", "mcp-engineer"],
      enableMcp: true,
      assistants: { cursor: true, claude: true, vscode: true, antigravity: true },
    });

    expect(res.installedAgents).toEqual(["spec-maestro", "mcp-engineer"]);
    expect(res.installedSkills).toContain("ai-dlc");
    expect(res.installedSkills).toContain("sdd");
    expect(res.installedSkills).toContain("mcp-builder");
    expect(res.installedSkills).toContain("security-mcp-guard");

    // Verificar arquivos no filesystem
    expect(existsSync(path.join(tmpDir, ".agent/agents/spec-maestro.md"))).toBe(true);
    expect(existsSync(path.join(tmpDir, ".agent/agents/mcp-engineer.md"))).toBe(true);
    expect(existsSync(path.join(tmpDir, ".agent/skills/ai-dlc/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(tmpDir, ".agent/skills/mcp-builder/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(tmpDir, ".agent/skills.json"))).toBe(true);
    expect(existsSync(path.join(tmpDir, "spec-docs/prompts.md"))).toBe(true);
    expect(existsSync(path.join(tmpDir, "AGENTS.md"))).toBe(true);
    expect(existsSync(path.join(tmpDir, ".cursorrules"))).toBe(true);
    expect(existsSync(path.join(tmpDir, ".cursor/rules/agentic-suite.mdc"))).toBe(true);
    expect(existsSync(path.join(tmpDir, "CLAUDE.md"))).toBe(true);
    expect(existsSync(path.join(tmpDir, ".cursor/mcp.json"))).toBe(true);
  });

  it("Modular E2E: deve inicializar com apenas 1 agente selecionado (spec-maestro)", async () => {
    const res = await scaffoldAgents({
      targetDir: tmpDir,
      selectedAgentIds: ["spec-maestro"],
      enableMcp: false,
    });

    expect(res.installedAgents).toEqual(["spec-maestro"]);
    expect(existsSync(path.join(tmpDir, ".agent/agents/spec-maestro.md"))).toBe(true);
    expect(existsSync(path.join(tmpDir, ".agent/agents/mcp-engineer.md"))).toBe(false);
    expect(existsSync(path.join(tmpDir, ".agent/skills/ai-dlc/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(tmpDir, ".agent/skills/mcp-builder/SKILL.md"))).toBe(false);
  });

  it("Incremental E2E: deve adicionar um segundo agente posteriormente sem corromper o primeiro", async () => {
    // 1. Instalar spec-maestro
    await scaffoldAgents({
      targetDir: tmpDir,
      selectedAgentIds: ["spec-maestro"],
      enableMcp: false,
    });

    let env = await detectEnvironment(tmpDir);
    expect(env.installedAgents).toEqual(["spec-maestro"]);

    // 2. Incrementar com mcp-engineer
    await scaffoldAgents({
      targetDir: tmpDir,
      selectedAgentIds: ["spec-maestro", "mcp-engineer"],
      enableMcp: true,
    });

    env = await detectEnvironment(tmpDir);
    expect(env.installedAgents).toContain("spec-maestro");
    expect(env.installedAgents).toContain("mcp-engineer");

    const agentsMd = await fs.readFile(path.join(tmpDir, "AGENTS.md"), "utf-8");
    expect(agentsMd).toContain("Spec Maestro (`spec-maestro`)");
    expect(agentsMd).toContain("MCP Engineer (`mcp-engineer`)");
  });

  it("Brown-Field E2E: deve respeitar repositório Git com código e configurações existentes", async () => {
    // Simular repo legado
    await fs.mkdir(path.join(tmpDir, ".git"));
    await fs.writeFile(path.join(tmpDir, "legacy.ts"), "export const a = 1;");
    await fs.writeFile(path.join(tmpDir, "AGENTS.md"), "# Regras Legadas do Time\n");

    const cursorDir = path.join(tmpDir, ".cursor");
    await fs.mkdir(cursorDir, { recursive: true });
    await fs.writeFile(
      path.join(cursorDir, "mcp.json"),
      JSON.stringify({ mcpServers: { custom: { command: "node", args: ["custom.js"] } } })
    );

    await scaffoldAgents({
      targetDir: tmpDir,
      selectedAgentIds: ["spec-maestro", "mcp-engineer"],
      enableMcp: true,
    });

    // Validar não-destrutividade
    expect(await fs.readFile(path.join(tmpDir, "legacy.ts"), "utf-8")).toBe("export const a = 1;");

    const agentsMd = await fs.readFile(path.join(tmpDir, "AGENTS.md"), "utf-8");
    expect(agentsMd).toContain("Regras Legadas do Time");
    expect(agentsMd).toContain("Spec Maestro");

    const mcpJson = JSON.parse(await fs.readFile(path.join(cursorDir, "mcp.json"), "utf-8"));
    expect(mcpJson.mcpServers.custom).toBeDefined();
    expect(mcpJson.mcpServers["agentic-suite"]).toBeDefined();
  });
});
