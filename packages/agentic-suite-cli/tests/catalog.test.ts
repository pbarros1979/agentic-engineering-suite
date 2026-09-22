import { describe, it, expect } from "vitest";
import {
  getAllAgents,
  getAgent,
  getAgentsByIds,
  isValidAgentId,
} from "../src/catalog.js";

describe("CLI Agent Registry Catalog Tests", () => {
  it("deve retornar todos os agentes registrados na suite", () => {
    const agents = getAllAgents();
    expect(agents.length).toBeGreaterThanOrEqual(2);
    expect(agents.map((a) => a.id)).toContain("spec-maestro");
    expect(agents.map((a) => a.id)).toContain("mcp-engineer");
  });

  it("deve recuperar um agente por ID", () => {
    const spec = getAgent("spec-maestro");
    expect(spec).toBeDefined();
    expect(spec?.name).toBe("Spec Maestro");
    expect(spec?.zeroCode).toBe(true);
    expect(spec?.requiresSpecDocs).toBe(true);
    expect(spec?.skills).toContain("ai-dlc");
    expect(spec?.skills).toContain("sdd");

    const mcp = getAgent("mcp-engineer");
    expect(mcp).toBeDefined();
    expect(mcp?.zeroCode).toBe(false);
    expect(mcp?.skills).toContain("mcp-builder");
    expect(mcp?.skills).toContain("security-mcp-guard");
  });

  it("deve validar IDs corretos e rejeitar IDs inválidos", () => {
    expect(isValidAgentId("spec-maestro")).toBe(true);
    expect(isValidAgentId("mcp-engineer")).toBe(true);
    expect(isValidAgentId("agente-fantasma")).toBe(false);
  });

  it("deve filtrar múltiplos agentes por IDs", () => {
    const subset = getAgentsByIds(["spec-maestro"]);
    expect(subset.length).toBe(1);
    expect(subset[0].id).toBe("spec-maestro");
  });
});
