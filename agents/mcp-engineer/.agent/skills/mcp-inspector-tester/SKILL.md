---
name: mcp-inspector-tester
description: Testes automatizados, validação de conformidade JSON-RPC 2.0 e depuração interativa de servidores MCP com MCP Inspector e Vitest.
---

# Skill: MCP Inspector & Tester

Esta skill estabelece os procedimentos de teste, validação e depuração para servidores **Model Context Protocol (MCP)**.

---

## 1. Ferramentas de Avaliação e Teste

### 1.1. MCP Inspector Oficial
O **MCP Inspector** (`@modelcontextprotocol/inspector`) é a ferramenta padrão recomendada para testar interativamente as capabilities do servidor, inspecionar mensagens JSON-RPC brutas e simular chamadas de tools.

```bash
# Executando o MCP Inspector contra um servidor local em TypeScript
npx @modelcontextprotocol/inspector node build/index.js
```

### 1.2. Testes Automatizados com Vitest
Utilize suites automatizadas de teste para validar:
- Validação de entrada dos schemas Zod (casos válidos, casos nulos, tipos incorretos).
- Respostas esperadas e sinalização adequada de `isError: true`.
- Ausência de caracteres espúrios emitidos em `stdout`.

---

## 2. Padrão de Teste Automatizado com Cliente em Memória

```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
// Importar servidor sob teste...

describe("MCP Server Test Suite", () => {
  let client: Client;
  let clientTransport: InMemoryTransport;
  let serverTransport: InMemoryTransport;

  beforeEach(async () => {
    [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    client = new Client(
      { name: "test-client", version: "1.0.0" },
      { capabilities: {} }
    );
    // Conectar servidor no serverTransport e cliente no clientTransport
  });

  it("deve listar ferramentas disponíveis", async () => {
    const tools = await client.listTools();
    expect(tools.tools.length).toBeGreaterThan(0);
    expect(tools.tools.map((t) => t.name)).toContain("sample_tool");
  });

  it("deve retornar isError quando argumentos forem inválidos", async () => {
    const result = await client.callTool({
      name: "sample_tool",
      arguments: { query: "" }, // inválido conforme min(1)
    });
    expect(result.isError).toBe(true);
  });
});
```

---

## 3. Checklist de Validação do Inspector
- [ ] O servidor inicializa sem erros de transporte.
- [ ] O catálogo de `tools`, `resources` e `prompts` é retornado completamente na listagem.
- [ ] Não há logs aparecendo na aba de mensagens JSON-RPC (`stdout` limpo).
- [ ] Parâmetros inválidos resultam em mensagem amigável com `isError: true` sem derrubar o processo.

