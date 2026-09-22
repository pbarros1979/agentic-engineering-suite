import { z } from "zod";
import fs from "node:fs/promises";
import { ToolDefinition } from "../../types.js";
import {
  safeEnsureDir,
  safeReadFile,
  safeWriteFile,
  safeExists,
  resolveSafePath,
} from "../../utils/safe-fs.js";

export const mcpTools: ToolDefinition[] = [
  {
    name: "mcp_scaffold_server",
    description: "Faz scaffolding de um servidor MCP completo e resiliente em TypeScript ESM com transporte Stdio, Zod e Vitest.",
    inputSchema: {
      type: "object",
      properties: {
        serverName: {
          type: "string",
          description: "Nome do servidor MCP (ex.: git-tools, workspace-indexer)",
        },
        destinationDir: {
          type: "string",
          description: "Diretório de destino relativo à raiz do workspace (padrão: extensions/<serverName>)",
        },
        description: {
          type: "string",
          description: "Descrição da finalidade do servidor MCP",
        },
        targetDir: {
          type: "string",
          description: "Diretório raiz do projeto (opcional)",
        },
      },
      required: ["serverName"],
    },
    schema: z.object({
      serverName: z.string().min(1),
      destinationDir: z.string().optional(),
      description: z.string().optional(),
      targetDir: z.string().optional(),
    }),
    handler: async (args, context) => {
      const baseDir = args.targetDir || context.baseDir;
      const cleanName = args.serverName.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
      const dest = args.destinationDir || `extensions/${cleanName}`;
      const desc = args.description || `Servidor MCP modular ${cleanName}`;

      await safeEnsureDir(baseDir, dest);
      await safeEnsureDir(baseDir, `${dest}/src`);
      await safeEnsureDir(baseDir, `${dest}/src/utils`);
      await safeEnsureDir(baseDir, `${dest}/tests`);

      const packageJson = {
        name: cleanName,
        version: "1.0.0",
        description: desc,
        type: "module",
        main: "dist/index.js",
        types: "dist/index.d.ts",
        bin: {
          [cleanName]: "dist/index.js",
        },
        scripts: {
          build: "tsc",
          watch: "tsc --watch",
          start: "node dist/index.js",
          test: "vitest run",
        },
        dependencies: {
          "@modelcontextprotocol/sdk": "^1.6.1",
          zod: "^3.24.2",
        },
        devDependencies: {
          "@types/node": "^22.13.4",
          typescript: "^5.7.3",
          vitest: "^3.0.7",
        },
      };

      const tsconfig = {
        compilerOptions: {
          target: "ES2022",
          module: "NodeNext",
          moduleResolution: "NodeNext",
          lib: ["ES2022"],
          outDir: "./dist",
          rootDir: "./src",
          declaration: true,
          strict: true,
          noImplicitAny: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
        },
        include: ["src/**/*"],
      };

      const safeFsSource = `import path from "node:path";

/**
 * Prevenção de Path Traversal: Garante que o caminho requisitado não fuja do baseDir.
 */
export function resolveSafePath(baseDir: string, relativePath: string = ""): string {
  const resolvedBase = path.resolve(baseDir);
  const targetPath = path.resolve(resolvedBase, relativePath);
  const relative = path.relative(resolvedBase, targetPath);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(\`Acesso negado: o caminho "\${relativePath}" escapa da sandbox de "\${baseDir}".\`);
  }

  return targetPath;
}
`;

      const indexSource = `#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { resolveSafePath } from "./utils/safe-fs.js";

// 1. Schema Zod estrito para a ferramenta de exemplo
const EchoSchema = z.object({
  message: z.string().min(1).describe("Mensagem enviada para processamento"),
});

// 2. Instanciação do servidor MCP
const server = new Server(
  {
    name: "${cleanName}",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 3. Catálogo de ferramentas disponíveis
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "echo",
        description: "Retorna a mensagem processada de forma segura.",
        inputSchema: {
          type: "object",
          properties: {
            message: { type: "string", description: "Mensagem enviada para processamento" },
          },
          required: ["message"],
        },
      },
    ],
  };
});

// 4. Execução de ferramentas com tratamento defensivo (isError: true)
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: rawArgs } = request.params;

  if (name === "echo") {
    try {
      const { message } = EchoSchema.parse(rawArgs);
      console.error(\`[INFO] Executando echo: "\${message}"\`);

      return {
        content: [{ type: "text", text: \`Processado com sucesso: \${message}\` }],
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(\`[ERROR] Falha na execução de "\${name}": \${errorMsg}\`);
      return {
        isError: true,
        content: [{ type: "text", text: \`Erro operacional: \${errorMsg}\` }],
      };
    }
  }

  return {
    isError: true,
    content: [{ type: "text", text: \`Ferramenta desconhecida: "\${name}"\` }],
  };
});

// 5. Inicialização com isolamento rigoroso de Stdio
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[INFO] Servidor MCP \\"${cleanName}\\" conectado via StdioServerTransport.");
}

main().catch((err) => {
  console.error("[FATAL] Falha de inicialização:", err);
  process.exit(1);
});
`;

      const testSource = `import { describe, it, expect, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

describe("${cleanName} Tests", () => {
  let client: Client;
  let server: Server;
  let clientTransport: InMemoryTransport;
  let serverTransport: InMemoryTransport;

  beforeEach(async () => {
    [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    server = new Server(
      { name: "${cleanName}-test", version: "1.0.0" },
      { capabilities: { tools: {} } }
    );

    server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "echo",
          description: "Echo",
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
          return { isError: true, content: [{ type: "text", text: "Parâmetros inválidos" }] };
        }
        return { content: [{ type: "text", text: parsed.data.message }] };
      }
      return { isError: true, content: [{ type: "text", text: "Tool not found" }] };
    });

    client = new Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });

    await server.connect(serverTransport);
    await client.connect(clientTransport);
  });

  it("deve listar ferramentas disponíveis", async () => {
    const res = await client.listTools();
    expect(res.tools.some((t) => t.name === "echo")).toBe(true);
  });

  it("deve responder corretamente a chamada válida", async () => {
    const res = await client.callTool({
      name: "echo",
      arguments: { message: "teste unitário" },
    });
    expect(res.isError).toBeFalsy();
    const content = res.content as { type: string; text: string }[];
    expect(content[0].text).toBe("teste unitário");
  });

  it("deve sinalizar isError quando argumentos forem inválidos", async () => {
    const res = await client.callTool({
      name: "echo",
      arguments: { message: "" },
    });
    expect(res.isError).toBe(true);
  });
});
`;

      const readmeSource = `# ${cleanName}

${desc}

Criado pelo **MCP Engineer** em conformidade com as diretrizes do ecossistema Agentic Engineering Suite.

## Requisitos
- Node.js 20+
- TypeScript ESM

## Comandos
- \`npm run build\`: Compila para dist/
- \`npm test\`: Executa a suite de testes Vitest
- \`npm start\`: Inicia o servidor MCP com transporte Stdio
`;

      const files = [
        { path: `${dest}/package.json`, content: JSON.stringify(packageJson, null, 2) },
        { path: `${dest}/tsconfig.json`, content: JSON.stringify(tsconfig, null, 2) },
        { path: `${dest}/src/utils/safe-fs.ts`, content: safeFsSource },
        { path: `${dest}/src/index.ts`, content: indexSource },
        { path: `${dest}/tests/server.test.ts`, content: testSource },
        { path: `${dest}/README.md`, content: readmeSource },
      ];

      for (const item of files) {
        await safeWriteFile(baseDir, item.path, item.content);
      }

      return {
        content: [
          {
            type: "text",
            text: `[MCP Engineer] Servidor MCP "${cleanName}" criado com sucesso em "${dest}":\n\n` +
              files.map((f) => `  ✓ ${f.path}`).join("\n") +
              `\n\nChecklist cumprido:\n` +
              `  ✓ Isolamento obrigatório de Stdio (console.error)\n` +
              `  ✓ Schemas Zod e validação defensiva isError: true\n` +
              `  ✓ Proteção contra Path Traversal em utils/safe-fs.ts\n` +
              `  ✓ Suite de testes Vitest com InMemoryTransport`,
          },
        ],
      };
    },
  },
  {
    name: "mcp_validate_schema",
    description: "Analisa código TypeScript de servidor MCP contra as diretrizes do MCP Engineer (isolamento de stdio, Zod, isError, transportes).",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "Código-fonte TypeScript para validação estática",
        },
        filePath: {
          type: "string",
          description: "Caminho de arquivo para leitura e validação",
        },
        targetDir: {
          type: "string",
          description: "Diretório base (opcional)",
        },
      },
    },
    schema: z.object({
      code: z.string().optional(),
      filePath: z.string().optional(),
      targetDir: z.string().optional(),
    }),
    handler: async (args, context) => {
      const baseDir = args.targetDir || context.baseDir;
      let sourceCode = args.code;

      if (!sourceCode && args.filePath) {
        if (!safeExists(baseDir, args.filePath)) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: `[MCP Engineer] Arquivo "${args.filePath}" não encontrado para validação.`,
              },
            ],
          };
        }
        sourceCode = await safeReadFile(baseDir, args.filePath);
      }

      if (!sourceCode) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `[MCP Engineer] Forneça o parâmetro "code" ou "filePath" para validação.`,
            },
          ],
        };
      }

      const issues: string[] = [];
      const successes: string[] = [];

      // 1. Verificar poluição de stdout por console.log
      if (/console\.log\s*\(/m.test(sourceCode)) {
        issues.push("CRÍTICO: Uso detectado de 'console.log()'. Em servidores Stdio, isso quebra o stream JSON-RPC 2.0. Substitua por 'console.error()'.");
      } else {
        successes.push("Isolamento de Stdio preservado: sem 'console.log()' direto.");
      }

      // 2. Verificar uso de Zod
      if (/from\s+["']zod["']|z\./m.test(sourceCode)) {
        successes.push("Validação com Zod detectada para tipagem de runtime.");
      } else {
        issues.push("AVISO: Nenhum schema Zod detectado. Recomenda-se validação estrita de argumentos com Zod.");
      }

      // 3. Verificar tratamento defensivo com isError
      if (/isError:\s*true/m.test(sourceCode)) {
        successes.push("Tratamento defensivo de erro com 'isError: true' presente.");
      } else {
        issues.push("ALERTA: 'isError: true' não foi encontrado nos handlers de CallTool. Garanta respostas estruturadas de erro.");
      }

      // 4. Verificar importação da SDK
      if (/@modelcontextprotocol\/sdk/m.test(sourceCode)) {
        successes.push("Uso do SDK oficial @modelcontextprotocol/sdk confirmado.");
      } else {
        issues.push("AVISO: Importação de @modelcontextprotocol/sdk não detectada.");
      }

      const score = Math.max(0, 100 - issues.length * 25);
      const passed = !issues.some((i) => i.startsWith("CRÍTICO"));

      const report = [
        `[MCP Engineer] Relatório de Validação de Conformidade MCP`,
        `Score: ${score}/100 | Resultado: ${passed ? "APROVADO" : "REPROVADO"}`,
        `\nConformidades Verificadas:\n${successes.map((s) => `  ✓ ${s}`).join("\n")}`,
        issues.length > 0
          ? `\nProblemas Encontrados:\n${issues.map((i) => `  ✗ ${i}`).join("\n")}`
          : "\nCódigo 100% aderente aos padrões do MCP Engineer.",
      ].join("\n");

      return {
        isError: !passed,
        content: [{ type: "text", text: report }],
      };
    },
  },
  {
    name: "mcp_audit_security",
    description: "Audita potenciais vulnerabilidades de segurança (Path Traversal, injeção de comandos, vazamento de credenciais) em arquivos do servidor MCP.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "Arquivo específico para auditar (opcional)",
        },
        targetDir: {
          type: "string",
          description: "Diretório base a ser auditado",
        },
      },
    },
    schema: z.object({
      filePath: z.string().optional(),
      targetDir: z.string().optional(),
    }),
    handler: async (args, context) => {
      const baseDir = args.targetDir || context.baseDir;
      const findings: { file: string; risk: string; severity: "ALTA" | "MÉDIA" | "BAIXA" }[] = [];

      const auditContent = (fileRel: string, content: string) => {
        // Path Traversal check: direct fs access with unverified params
        if (/fs\.(readFile|writeFile|mkdir|unlink)\s*\([^)]*\)/.test(content)) {
          if (!/resolveSafePath/.test(content) && !/path\.resolve/.test(content)) {
            findings.push({
              file: fileRel,
              risk: "Operações de sistema de arquivos detectadas sem proteção aparente contra Path Traversal (resolveSafePath).",
              severity: "ALTA",
            });
          }
        }

        // Command Injection check
        if (/child_process|exec\s*\(|spawn\s*\(/.test(content)) {
          if (/exec\s*\([^[]*`[^`]*\$\{/.test(content)) {
            findings.push({
              file: fileRel,
              risk: "Possível interpolação dinâmica em comandos shell (Command Injection).",
              severity: "ALTA",
            });
          }
        }

        // Hardcoded secrets check
        if (/(api[_-]?key|secret|password|bearer|ghp_[a-zA-Z0-9]{20,}|sk-[a-zA-Z0-9]{20,})\s*[:=]\s*["'][^"']+["']/i.test(content)) {
          findings.push({
            file: fileRel,
            risk: "Possível credencial ou token hardcoded detectado no código.",
            severity: "ALTA",
          });
        }

        // Stdout stream pollution
        if (/console\.log\s*\(/.test(content)) {
          findings.push({
            file: fileRel,
            risk: "Uso de console.log() corrompe o stream de dados do transporte StdioServerTransport.",
            severity: "MÉDIA",
          });
        }
      };

      if (args.filePath) {
        if (!safeExists(baseDir, args.filePath)) {
          return {
            isError: true,
            content: [{ type: "text", text: `Arquivo "${args.filePath}" não encontrado.` }],
          };
        }
        const text = await safeReadFile(baseDir, args.filePath);
        auditContent(args.filePath, text);
      } else {
        // Scan recursive in src/ if exists
        const srcDir = "src";
        if (safeExists(baseDir, srcDir)) {
          const scanDir = async (relDir: string) => {
            const safeDir = resolveSafePath(baseDir, relDir);
            const entries = await fs.readdir(safeDir, { withFileTypes: true });
            for (const ent of entries) {
              const rel = `${relDir}/${ent.name}`;
              if (ent.isDirectory() && ent.name !== "node_modules") {
                await scanDir(rel);
              } else if (ent.isFile() && (ent.name.endsWith(".ts") || ent.name.endsWith(".js"))) {
                const content = await safeReadFile(baseDir, rel);
                auditContent(rel, content);
              }
            }
          };
          await scanDir(srcDir);
        }
      }

      const high = findings.filter((f) => f.severity === "ALTA").length;
      const med = findings.filter((f) => f.severity === "MÉDIA").length;
      const low = findings.filter((f) => f.severity === "BAIXA").length;

      const report = [
        `[MCP Engineer] Auditoria de Segurança & Sandbox (security-mcp-guard)`,
        `Vulnerabilidades: ${high} ALTA | ${med} MÉDIA | ${low} BAIXA`,
        findings.length === 0
          ? `\nNenhuma vulnerabilidade crítica ou falha de sandbox detectada!`
          : `\nApontamentos de Segurança:\n` +
            findings
              .map((f) => `  [${f.severity}] ${f.file}: ${f.risk}`)
              .join("\n"),
      ].join("\n");

      return {
        isError: high > 0,
        content: [{ type: "text", text: report }],
      };
    },
  },
];
