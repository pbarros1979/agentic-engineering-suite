import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import { ToolRegistry } from "../src/registry.js";
import { specMaestroModule } from "../src/modules/spec-maestro/index.js";
import { safeExists, safeReadFile } from "../src/utils/safe-fs.js";

describe("Spec Maestro Module Tests", () => {
  let tmpDir: string;
  let registry: ToolRegistry;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "spec-maestro-test-"));
    registry = new ToolRegistry();
    registry.registerModule(specMaestroModule);
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("deve inicializar spec-docs e criar prompts.md com spec_init_workspace", async () => {
    const res = await registry.executeTool("spec_init_workspace", {}, { baseDir: tmpDir });
    expect(res.isError).toBeFalsy();
    expect(safeExists(tmpDir, "spec-docs/plans")).toBe(true);
    expect(safeExists(tmpDir, "spec-docs/requirements")).toBe(true);
    expect(safeExists(tmpDir, "spec-docs/specs")).toBe(true);
    expect(safeExists(tmpDir, "spec-docs/prompts.md")).toBe(true);
  });

  it("deve criar novo intent numerado com spec_create_intent e registrar em prompts.md", async () => {
    await registry.executeTool("spec_init_workspace", {}, { baseDir: tmpDir });

    const res = await registry.executeTool(
      "spec_create_intent",
      {
        intentName: "auth-gateway",
        title: "API Gateway Authentication",
        businessValue: "Proteção contra acessos não autorizados",
        scope: "Implementação de JWT e RBAC",
      },
      { baseDir: tmpDir }
    );

    expect(res.isError).toBeFalsy();
    expect(safeExists(tmpDir, "spec-docs/plans/01_auth-gateway.md")).toBe(true);

    const prompts = await safeReadFile(tmpDir, "spec-docs/prompts.md");
    expect(prompts).toContain("API Gateway Authentication");
  });

  it("deve gerar o pacote contratual SDD completo com os 5 arquivos", async () => {
    const res = await registry.executeTool(
      "spec_generate_sdd_package",
      {
        featureName: "billing-service",
        description: "Serviço de faturamento recorrente",
      },
      { baseDir: tmpDir }
    );

    expect(res.isError).toBeFalsy();
    const basePath = "spec-docs/specs/billing-service";
    expect(safeExists(tmpDir, `${basePath}/constitution.md`)).toBe(true);
    expect(safeExists(tmpDir, `${basePath}/spec.md`)).toBe(true);
    expect(safeExists(tmpDir, `${basePath}/plan.md`)).toBe(true);
    expect(safeExists(tmpDir, `${basePath}/tasks.md`)).toBe(true);
    expect(safeExists(tmpDir, `${basePath}/converge.md`)).toBe(true);
  });

  it("deve auditar convergência e calcular percentual de checkboxes", async () => {
    await registry.executeTool("spec_init_workspace", {}, { baseDir: tmpDir });
    await registry.executeTool(
      "spec_generate_sdd_package",
      {
        featureName: "sample-feature",
        description: "Teste de auditoria",
      },
      { baseDir: tmpDir }
    );

    const auditRes = await registry.executeTool(
      "spec_audit_convergence",
      { featureName: "sample-feature" },
      { baseDir: tmpDir }
    );

    expect(auditRes.isError).toBeFalsy();
    expect(auditRes.content[0].text).toContain("Relatório de Auditoria de Convergência");
    expect(auditRes.content[0].text).toContain("sample-feature");
  });
});
