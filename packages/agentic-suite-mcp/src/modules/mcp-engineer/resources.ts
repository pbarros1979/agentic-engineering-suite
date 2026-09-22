import { ResourceDefinition } from "../../types.js";

const MCP_SERVER_TEMPLATE = `import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { resolveSafePath } from "./utils/safe-fs.js";

// 1. Schema de Validação Zod
const EchoSchema = z.object({
  message: z.string().min(1).describe("Mensagem para ecoar"),
});

// 2. Instanciação do Servidor MCP
const server = new Server(
  {
    name: "{{serverName}}",
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
        name: "echo",
        description: "Ecoa uma mensagem com segurança e tipagem garantida.",
        inputSchema: {
          type: "object",
          properties: {
            message: { type: "string", description: "Mensagem para ecoar" },
          },
          required: ["message"],
        },
      },
    ],
  };
});

// 4. Execução de Tools com Tratamento Defensivo
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: rawArgs } = request.params;

  if (name === "echo") {
    try {
      const { message } = EchoSchema.parse(rawArgs);
      console.error(\`[INFO] Processando echo: \${message}\`);

      return {
        content: [{ type: "text", text: \`Echo: \${message}\` }],
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(\`[ERROR] Falha na tool "echo": \${errorMsg}\`);
      return {
        isError: true,
        content: [{ type: "text", text: \`Erro operacional: \${errorMsg}\` }],
      };
    }
  }

  return {
    isError: true,
    content: [{ type: "text", text: \`Ferramenta desconhecida: \${name}\` }],
  };
});

// 5. Inicialização com Transporte Stdio Seguro
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[INFO] Servidor MCP inicializado com sucesso via StdioTransport.");
}

main().catch((err) => {
  console.error("[FATAL] Erro fatal no servidor MCP:", err);
  process.exit(1);
});
`;

const SAFE_FS_TEMPLATE = `import path from "node:path";

/**
 * Valida se o caminho solicitado está estritamente contido no diretório base seguro.
 * @throws Error se houver tentativa de escape de sandbox (Path Traversal).
 */
export function resolveSafePath(baseDir: string, relativePath: string = ""): string {
  const resolvedBase = path.resolve(baseDir);
  const targetPath = path.resolve(resolvedBase, relativePath);
  const relative = path.relative(resolvedBase, targetPath);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(\`Acesso negado: o caminho "\${relativePath}" viola os limites da sandbox em "\${baseDir}".\`);
  }

  return targetPath;
}
`;

const VITEST_TEST_TEMPLATE = `import { describe, it, expect, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

describe("MCP Server Test Suite", () => {
  let client: Client;
  let server: Server;
  let clientTransport: InMemoryTransport;
  let serverTransport: InMemoryTransport;

  beforeEach(async () => {
    [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    server = new Server(
      { name: "test-server", version: "1.0.0" },
      { capabilities: { tools: {} } }
    );

    server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "echo",
          description: "Ecoa mensagem",
          inputSchema: {
            type: "object",
            properties: { message: { type: "string" } },
            required: ["message"],
          },
        },
      ],
    }));

    server.setRequestHandler(CallToolRequestSchema, async (req) => {
      if (req.params.name === "echo") {
        const schema = z.object({ message: z.string().min(1) });
        const parsed = schema.safeParse(req.params.arguments);
        if (!parsed.success) {
          return { isError: true, content: [{ type: "text", text: "Argumentos inválidos" }] };
        }
        return { content: [{ type: "text", text: \`Echo: \${parsed.data.message}\` }] };
      }
      return { isError: true, content: [{ type: "text", text: "Not found" }] };
    });

    client = new Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });

    await server.connect(serverTransport);
    await client.connect(clientTransport);
  });

  it("deve listar ferramentas disponíveis", async () => {
    const tools = await client.listTools();
    expect(tools.tools.length).toBe(1);
    expect(tools.tools[0].name).toBe("echo");
  });

  it("deve executar ferramenta com argumentos válidos", async () => {
    const result = await client.callTool({
      name: "echo",
      arguments: { message: "Olá MCP" },
    });
    expect(result.isError).toBeFalsy();
    const content = result.content as { type: string; text: string }[];
    expect(content[0].text).toContain("Olá MCP");
  });

  it("deve retornar isError quando argumentos forem inválidos", async () => {
    const result = await client.callTool({
      name: "echo",
      arguments: { message: "" },
    });
    expect(result.isError).toBe(true);
  });
});
`;

export const mcpResources: ResourceDefinition[] = [
  {
    uri: "mcp://templates/server",
    name: "Canonical MCP Server Template",
    description: "Template TypeScript ESM oficial com isolamento de stdio e Zod",
    mimeType: "application/typescript",
    read: async () => ({
      uri: "mcp://templates/server",
      mimeType: "application/typescript",
      text: MCP_SERVER_TEMPLATE,
    }),
  },
  {
    uri: "mcp://templates/safe-fs",
    name: "Safe-FS Sandbox Utility Template",
    description: "Utilitário de proteção contra Path Traversal e contenção em sandbox",
    mimeType: "application/typescript",
    read: async () => ({
      uri: "mcp://templates/safe-fs",
      mimeType: "application/typescript",
      text: SAFE_FS_TEMPLATE,
    }),
  },
  {
    uri: "mcp://templates/vitest-test",
    name: "Vitest InMemoryTransport Test Template",
    description: "Template de testes automatizados com InMemoryTransport e Vitest",
    mimeType: "application/typescript",
    read: async () => ({
      uri: "mcp://templates/vitest-test",
      mimeType: "application/typescript",
      text: VITEST_TEST_TEMPLATE,
    }),
  },
];
