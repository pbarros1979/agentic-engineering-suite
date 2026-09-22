import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import { mergeAgentsMd, mergeCursorRules, mergeClaudeMd } from "../src/rules-merger.js";
import { getAgentsByIds } from "../src/catalog.js";

describe("Rules Merger Tests", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "rules-merger-test-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("deve criar AGENTS.md preservando regras customizadas do usuário de forma não-destrutiva", async () => {
    const initialContent = "# Minhas Regras Customizadas de Negócio\n- Não quebre a API pública.\n";
    await fs.writeFile(path.join(tmpDir, "AGENTS.md"), initialContent, "utf-8");

    const agents = getAgentsByIds(["spec-maestro", "mcp-engineer"]);
    await mergeAgentsMd(tmpDir, agents);

    const merged = await fs.readFile(path.join(tmpDir, "AGENTS.md"), "utf-8");
    expect(merged).toContain("Minhas Regras Customizadas de Negócio");
    expect(merged).toContain("Diretrizes do Ecossistema: Agentic Engineering Suite");
    expect(merged).toContain("Spec Maestro (`spec-maestro`)");
    expect(merged).toContain("MCP Engineer (`mcp-engineer`)");
  });

  it("deve ser 100% idempotente ao executar mergeAgentsMd repetidas vezes", async () => {
    const agents = getAgentsByIds(["spec-maestro", "mcp-engineer"]);
    await mergeAgentsMd(tmpDir, agents);
    const firstRun = await fs.readFile(path.join(tmpDir, "AGENTS.md"), "utf-8");

    await mergeAgentsMd(tmpDir, agents);
    const secondRun = await fs.readFile(path.join(tmpDir, "AGENTS.md"), "utf-8");

    expect(secondRun).toBe(firstRun);
    // Verificar que não duplicou os cabeçalhos
    const matches = secondRun.match(/BEGIN AGENTIC-SUITE: CORE/g) || [];
    expect(matches.length).toBe(1);
  });

  it("deve mesclar e atualizar .cursorrules e .cursor/rules/agentic-suite.mdc", async () => {
    const agents = getAgentsByIds(["spec-maestro"]);
    const files = await mergeCursorRules(tmpDir, agents);

    expect(files.length).toBe(2);
    const cursorrules = await fs.readFile(path.join(tmpDir, ".cursorrules"), "utf-8");
    expect(cursorrules).toContain("Spec Maestro");

    const mdc = await fs.readFile(path.join(tmpDir, ".cursor/rules/agentic-suite.mdc"), "utf-8");
    expect(mdc).toContain("alwaysApply: true");
    expect(mdc).toContain("Spec Maestro");
  });

  it("deve mesclar e atualizar CLAUDE.md", async () => {
    const agents = getAgentsByIds(["mcp-engineer"]);
    await mergeClaudeMd(tmpDir, agents);

    const claude = await fs.readFile(path.join(tmpDir, "CLAUDE.md"), "utf-8");
    expect(claude).toContain("Claude Code Guidelines - Agentic Engineering Suite");
    expect(claude).toContain("MCP Engineer");
  });
});
