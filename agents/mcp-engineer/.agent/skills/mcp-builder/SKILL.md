---
name: mcp-builder
description: Criação, scaffolding e evolução de servidores MCP modulares em TypeScript/Node.js com validação Zod, transporte stdio/sse e SDK oficial.
---

# Skill: MCP Builder

Esta skill orienta a construção de servidores **Model Context Protocol (MCP)** robustos, seguros e fortemente tipados em TypeScript / Node.js moderno.

---

## 1. Diretrizes Arquiteturais Inegociáveis

1. **Isolamento Absoluto de Stdio**:
   > [!CAUTION]
   > Em servidores MCP que operam com `StdioServerTransport`, o canal `process.stdout` é de posse exclusiva do protocolo JSON-RPC 2.0. Qualquer `console.log()` comum no código-fonte polui o stream de dados e quebra a conexão do cliente.
   - Todos os logs, avisos, depurações e traces DEVEM ser direcionados para `console.error()` (`process.stderr`) ou gravados em arquivo dedicado.

2. **Validação Estrita em Tempo de Execução com Zod**:
   - Todo parâmetro recebido por uma tool deve ser validado via schema `z.object({...})`.
   - Mantenha paridade absoluta entre o `inputSchema` declarado em `ListToolsRequestSchema` e o schema `Zod` validado no handler `CallToolRequestSchema`.

3. **Módulos Nativos ECMAScript (ESM)**:
   - Configuração de `package.json` com `"type": "module"`.
   - Imports com extensões explícitas (ex.: `import ... from "./types.js"`).

4. **Tratamento Resiliente com `isError: true`**:
   - Falhas operacionais e de negócio (ex.: parâmetro incorreto, arquivo ausente) NÃO devem derrubar o processo com exceções não capturadas.
   - Retorne um payload estruturado:
     ```typescript
     return {
       isError: true,
       content: [{ type: "text", text: `Erro operacional: ${error.message}` }],
     };
     ```
   - Isso permite à LLM entender a causa da falha e autocorrigir a chamada.

---

## 2. Estrutura Canônica de um Servidor MCP

```text
extensions/<server-name>/
├── src/
│   ├── index.ts             # Ponto de entrada, inicialização e conexão de transporte
│   ├── tools/               # Handlers de Tools e schemas Zod
│   │   ├── search-tools.ts
│   │   └── file-tools.ts
│   ├── resources/           # Provedores de Resources (se aplicável)
│   └── prompts/             # Prompts parametrizáveis (se aplicável)
├── tests/
│   └── server.test.ts       # Testes unitários com Vitest
├── package.json             # Dependências (@modelcontextprotocol/sdk, zod, etc.)
└── tsconfig.json            # Configuração TypeScript estrita (ESM, strict: true)
```

---

## 3. Template Canônico de Implementação

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// 1. Schema de Validação Zod
const SampleToolSchema = z.object({
  query: z.string().min(1).describe("Termo de busca"),
});

// 2. Criação do Servidor
const server = new Server(
  {
    name: "workspace-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 3. Catálogo de Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "sample_tool",
        description: "Executa uma operação de exemplo de forma segura.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Termo de busca" },
          },
          required: ["query"],
        },
      },
    ],
  };
});

// 4. Execução de Tools
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "sample_tool") {
    try {
      const { query } = SampleToolSchema.parse(request.params.arguments);
      console.error(`[INFO] Processando query: ${query}`);

      return {
        content: [{ type: "text", text: `Resultado para: ${query}` }],
      };
    } catch (err) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Erro ao executar tool: ${err instanceof Error ? err.message : String(err)}`,
          },
        ],
      };
    }
  }

  throw new Error(`Tool desconhecida: ${request.params.name}`);
});

// 5. Inicialização com Transporte Stdio
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[INFO] Servidor MCP iniciado via StdioTransport.");
}

main().catch((err) => {
  console.error("[FATAL] Erro ao iniciar servidor MCP:", err);
  process.exit(1);
});
```

