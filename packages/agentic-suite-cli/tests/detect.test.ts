import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import { detectEnvironment } from "../src/detect.js";

describe("CLI Environment Detection Tests", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "cli-detect-test-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("deve detectar diretório Green-Field sem Git", async () => {
    const env = await detectEnvironment(tmpDir);
    expect(env.isGitRepo).toBe(false);
    expect(env.isBrownField).toBe(false);
    expect(env.installedAgents.length).toBe(0);
  });

  it("deve detectar repositório Git e Brown-field com arquivos existentes", async () => {
    await fs.mkdir(path.join(tmpDir, ".git"));
    await fs.writeFile(path.join(tmpDir, "package.json"), JSON.stringify({ name: "legacy-app" }));
    await fs.writeFile(path.join(tmpDir, "index.ts"), "console.log('legacy');");

    const env = await detectEnvironment(tmpDir);
    expect(env.isGitRepo).toBe(true);
    expect(env.isBrownField).toBe(true);
    expect(env.detectedLanguages).toContain("TypeScript/JavaScript");
  });

  it("deve identificar agentes previamente instalados em .agent/agents/", async () => {
    const agentsDir = path.join(tmpDir, ".agent", "agents");
    await fs.mkdir(agentsDir, { recursive: true });
    await fs.writeFile(path.join(agentsDir, "spec-maestro.md"), "# Spec Maestro");

    const env = await detectEnvironment(tmpDir);
    expect(env.installedAgents).toContain("spec-maestro");
    expect(env.installedAgents).not.toContain("mcp-engineer");
  });
});
