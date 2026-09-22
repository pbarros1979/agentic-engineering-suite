import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { ToolRegistry } from "./registry.js";
import { specMaestroModule } from "./modules/spec-maestro/index.js";
import { mcpEngineerModule } from "./modules/mcp-engineer/index.js";

export function createMcpServer(baseDir: string = process.cwd()): {
  server: Server;
  registry: ToolRegistry;
} {
  const registry = new ToolRegistry();
  registry.registerModule(specMaestroModule);
  registry.registerModule(mcpEngineerModule);

  const server = new Server(
    {
      name: "@agentic-engineering-suite/mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
        prompts: {},
        resources: {},
      },
    }
  );

  // 1. ListTools Handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools = registry.getTools().map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    }));
    return { tools };
  });

  // 2. CallTool Handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: rawArgs } = request.params;
    console.error(`[INFO] Chamada recebida para a ferramenta: "${name}"`);

    try {
      const result = await registry.executeTool(name, rawArgs, { baseDir });
      return result as any;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[ERROR] Exceção não tratada na ferramenta "${name}":`, msg);
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Erro interno ao executar a ferramenta "${name}": ${msg}`,
          },
        ],
      } as any;
    }
  });

  // 3. ListPrompts Handler
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    const prompts = registry.getPrompts().map((p) => ({
      name: p.name,
      description: p.description,
      arguments: p.arguments,
    }));
    return { prompts };
  });

  // 4. GetPrompt Handler
  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: rawArgs } = request.params;
    console.error(`[INFO] Recuperando prompt: "${name}"`);
    try {
      const promptResult = await registry.executePrompt(
        name,
        (rawArgs as Record<string, string>) || {}
      );
      return promptResult as any;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[ERROR] Falha ao recuperar prompt "${name}":`, msg);
      throw err;
    }
  });

  // 5. ListResources Handler
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    const resources = registry.getResources().map((r) => ({
      uri: r.uri,
      name: r.name,
      description: r.description,
      mimeType: r.mimeType,
    }));
    return { resources };
  });

  // 6. ReadResource Handler
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    console.error(`[INFO] Lendo resource: "${uri}"`);
    try {
      const resource = await registry.readResource(uri);
      return {
        contents: [
          {
            uri: resource.uri,
            mimeType: resource.mimeType,
            text: resource.text,
          },
        ],
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[ERROR] Falha ao ler resource "${uri}":`, msg);
      throw err;
    }
  });

  return { server, registry };
}
