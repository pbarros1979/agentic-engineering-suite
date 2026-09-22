import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createMcpServer } from "../src/server.js";

describe("MCP Server E2E InMemory Tests", () => {
  let tmpDir: string;
  let client: Client;
  let clientTransport: InMemoryTransport;
  let serverTransport: InMemoryTransport;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "mcp-e2e-test-"));
    const { server } = createMcpServer(tmpDir);

    [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    client = new Client(
      { name: "test-client", version: "1.0.0" },
      { capabilities: {} }
    );

    await server.connect(serverTransport);
    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("deve expor e listar todas as ferramentas dos módulos spec e mcp", async () => {
    const res = await client.listTools();
    const toolNames = res.tools.map((t) => t.name);

    expect(toolNames).toContain("spec_init_workspace");
    expect(toolNames).toContain("spec_create_intent");
    expect(toolNames).toContain("spec_generate_sdd_package");
    expect(toolNames).toContain("spec_audit_convergence");
    expect(toolNames).toContain("mcp_scaffold_server");
    expect(toolNames).toContain("mcp_validate_schema");
    expect(toolNames).toContain("mcp_audit_security");
  });

  it("deve executar spec_init_workspace através do protocolo MCP", async () => {
    const res = await client.callTool({
      name: "spec_init_workspace",
      arguments: {},
    });

    expect(res.isError).toBeFalsy();
    const content = res.content as { type: string; text: string }[];
    expect(content[0].text).toContain("[Spec Maestro] Workspace de governança inicializado");
  });

  it("deve listar e recuperar prompts disponíveis", async () => {
    const listRes = await client.listPrompts();
    const promptNames = listRes.prompts.map((p) => p.name);
    expect(promptNames).toContain("spec/mob-elaboration");
    expect(promptNames).toContain("mcp/design-server");

    const getRes = await client.getPrompt({
      name: "spec/mob-elaboration",
      arguments: { intent: "Novo sistema de pagamentos" },
    });

    expect(getRes.messages.length).toBeGreaterThan(0);
    expect(getRes.messages[0].content.text).toContain("Novo sistema de pagamentos");
  });

  it("deve listar e ler resources sob demanda", async () => {
    const listRes = await client.listResources();
    const uris = listRes.resources.map((r) => r.uri);
    expect(uris).toContain("spec://templates/constitution");
    expect(uris).toContain("mcp://templates/server");

    const readRes = await client.readResource({
      uri: "spec://templates/constitution",
    });

    expect(readRes.contents.length).toBe(1);
    const content = readRes.contents[0] as { uri: string; text: string };
    expect(content.text).toContain("Zero-Code de Produção");
  });

  it("deve retornar isError defensivo para argumentos inválidos sem quebrar a conexão", async () => {
    const res = await client.callTool({
      name: "spec_create_intent",
      arguments: {
        // faltando campos obrigatórios como intentName, title, etc.
      },
    });

    expect(res.isError).toBe(true);
    const content = res.content as { type: string; text: string }[];
    expect(content[0].text).toContain("Falha na validação");
  });
});
