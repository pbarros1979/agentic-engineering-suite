import { describe, it, expect } from "vitest";
import { ToolRegistry } from "../src/registry.js";
import { specMaestroModule } from "../src/modules/spec-maestro/index.js";
import { mcpEngineerModule } from "../src/modules/mcp-engineer/index.js";

describe("ToolRegistry Tests", () => {
  it("deve registrar módulos e expor catálogo unificado", () => {
    const registry = new ToolRegistry();
    registry.registerModule(specMaestroModule);
    registry.registerModule(mcpEngineerModule);

    const modules = registry.getModules();
    expect(modules.length).toBe(2);

    const tools = registry.getTools();
    expect(tools.map((t) => t.name)).toContain("spec_init_workspace");
    expect(tools.map((t) => t.name)).toContain("spec_create_intent");
    expect(tools.map((t) => t.name)).toContain("spec_generate_sdd_package");
    expect(tools.map((t) => t.name)).toContain("spec_audit_convergence");
    expect(tools.map((t) => t.name)).toContain("mcp_scaffold_server");
    expect(tools.map((t) => t.name)).toContain("mcp_validate_schema");
    expect(tools.map((t) => t.name)).toContain("mcp_audit_security");

    const prompts = registry.getPrompts();
    expect(prompts.map((p) => p.name)).toContain("spec/mob-elaboration");
    expect(prompts.map((p) => p.name)).toContain("mcp/design-server");

    const resources = registry.getResources();
    expect(resources.map((r) => r.uri)).toContain("spec://templates/constitution");
    expect(resources.map((r) => r.uri)).toContain("mcp://templates/server");
  });

  it("deve retornar isError defensivo para ferramentas inexistentes", async () => {
    const registry = new ToolRegistry();
    const result = await registry.executeTool("ferramenta_inexistente", {}, { baseDir: "." });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("não encontrada");
  });
});
