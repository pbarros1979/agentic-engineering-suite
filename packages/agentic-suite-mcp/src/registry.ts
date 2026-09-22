import {
  ModuleDefinition,
  ToolDefinition,
  PromptDefinition,
  ResourceDefinition,
  ToolContext,
  ToolResult,
  PromptResult,
  ResourceContent,
} from "./types.js";

export class ToolRegistry {
  private modules = new Map<string, ModuleDefinition>();

  registerModule(module: ModuleDefinition): void {
    if (this.modules.has(module.id)) {
      console.error(`[WARN] Módulo "${module.id}" já registrado. Sobrescrevendo...`);
    }
    this.modules.set(module.id, module);
  }

  getModules(): ModuleDefinition[] {
    return Array.from(this.modules.values());
  }

  getTools(): ToolDefinition[] {
    const tools: ToolDefinition[] = [];
    for (const mod of this.modules.values()) {
      tools.push(...mod.tools);
    }
    return tools;
  }

  findTool(name: string): ToolDefinition | undefined {
    for (const mod of this.modules.values()) {
      const found = mod.tools.find((t) => t.name === name);
      if (found) return found;
    }
    return undefined;
  }

  async executeTool(
    name: string,
    rawArgs: unknown,
    context: ToolContext
  ): Promise<ToolResult> {
    const tool = this.findTool(name);
    if (!tool) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Erro: Ferramenta "${name}" não encontrada no registro da Agentic Engineering Suite.`,
          },
        ],
      };
    }

    try {
      const parsedArgs = tool.schema.parse(rawArgs ?? {});
      return await tool.handler(parsedArgs, context);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`[ERROR] Falha na execução da ferramenta "${name}":`, errorMsg);
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Falha na validação ou execução de "${name}": ${errorMsg}`,
          },
        ],
      };
    }
  }

  getPrompts(): PromptDefinition[] {
    const prompts: PromptDefinition[] = [];
    for (const mod of this.modules.values()) {
      prompts.push(...mod.prompts);
    }
    return prompts;
  }

  findPrompt(name: string): PromptDefinition | undefined {
    for (const mod of this.modules.values()) {
      const found = mod.prompts.find((p) => p.name === name);
      if (found) return found;
    }
    return undefined;
  }

  async executePrompt(
    name: string,
    args: Record<string, string>
  ): Promise<PromptResult> {
    const prompt = this.findPrompt(name);
    if (!prompt) {
      throw new Error(`Prompt "${name}" não encontrado no registro.`);
    }
    return await prompt.handler(args);
  }

  getResources(): ResourceDefinition[] {
    const resources: ResourceDefinition[] = [];
    for (const mod of this.modules.values()) {
      resources.push(...mod.resources);
    }
    return resources;
  }

  findResource(uri: string): ResourceDefinition | undefined {
    for (const mod of this.modules.values()) {
      const found = mod.resources.find((r) => r.uri === uri);
      if (found) return found;
    }
    return undefined;
  }

  async readResource(uri: string): Promise<ResourceContent> {
    const resource = this.findResource(uri);
    if (!resource) {
      throw new Error(`Resource "${uri}" não encontrado no registro.`);
    }
    return await resource.read();
  }
}
