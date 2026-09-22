import { ModuleDefinition } from "../../types.js";
import { mcpTools } from "./tools.js";
import { mcpPrompts } from "./prompts.js";
import { mcpResources } from "./resources.js";

export const mcpEngineerModule: ModuleDefinition = {
  id: "mcp-engineer",
  name: "MCP Engineer",
  namespace: "mcp",
  description: "Especialista em arquitetura, scaffolding, segurança e testes de servidores MCP (TypeScript/Node.js ESM) e agentes declarativos.",
  tools: mcpTools,
  prompts: mcpPrompts,
  resources: mcpResources,
};
