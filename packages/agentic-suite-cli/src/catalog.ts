export interface AgentDefinition {
  id: string;
  name: string;
  role: string;
  description: string;
  category: "governance" | "engineering" | "qa" | "devops";
  skills: string[];
  zeroCode: boolean;
  mcpNamespace: string;
  requiresSpecDocs: boolean;
  rulesSnippet: string;
}

export const AGENT_REGISTRY: AgentDefinition[] = [
  {
    id: "spec-maestro",
    name: "Spec Maestro",
    role: "SDLC Planning & Spec Architect",
    description: "Inception (Mob Elaboration), DDD, pacotes SDD contratuais e auditoria de convergência.",
    category: "governance",
    skills: ["ai-dlc", "sdd"],
    zeroCode: true,
    mcpNamespace: "spec",
    requiresSpecDocs: true,
    rulesSnippet: `### Agente: Spec Maestro (\`spec-maestro\`)
- **Papel**: Arquiteto de Especificação e Governança do Ciclo de Vida (Inception, Mob Elaboration, DDD e SDD).
- **Fronteira Operacional Estrita**: **Zero-Code de Produção**. O Spec Maestro atua EXCLUSIVAMENTE no planejamento e elaboração de contratos em \`spec-docs/\`. Não escreve código executável em produção.
- **Artefatos sob Custódia**: \`spec-docs/plans/\`, \`spec-docs/specs/\`, \`spec-docs/prompts.md\`.
- **Skills Ativas**: \`ai-dlc\`, \`sdd\`.`,
  },
  {
    id: "mcp-engineer",
    name: "MCP Engineer",
    role: "MCP Servers & Markdown Agents Specialist",
    description: "Arquitetura, scaffolding, segurança e testes de servidores MCP e agentes declarativos em Markdown.",
    category: "engineering",
    skills: ["mcp-builder", "mcp-inspector-tester", "security-mcp-guard"],
    zeroCode: false,
    mcpNamespace: "mcp",
    requiresSpecDocs: false,
    rulesSnippet: `### Agente: MCP Engineer (\`mcp-engineer\`)
- **Papel**: Especialista em Servidores Model Context Protocol (MCP) e Agentes Declarativos em Markdown.
- **Fronteira Operacional**: Desenvolvimento de servidores MCP em TypeScript ESM, isolamento absoluto de Stdio (somente \`console.error\` para logs), validação de runtime com Zod e tratamento com \`isError: true\`.
- **Segurança & Sandbox**: Proteção obrigatória contra Path Traversal (\`resolveSafePath\`) e sanitização de comandos shell.
- **Skills Ativas**: \`mcp-builder\`, \`mcp-inspector-tester\`, \`security-mcp-guard\`.`,
  },
];

export function getAllAgents(): AgentDefinition[] {
  return [...AGENT_REGISTRY];
}

export function getAgent(id: string): AgentDefinition | undefined {
  return AGENT_REGISTRY.find((a) => a.id.toLowerCase() === id.toLowerCase());
}

export function getAgentsByIds(ids: string[]): AgentDefinition[] {
  return ids
    .map((id) => getAgent(id))
    .filter((a): a is AgentDefinition => a !== undefined);
}

export function isValidAgentId(id: string): boolean {
  return AGENT_REGISTRY.some((a) => a.id.toLowerCase() === id.toLowerCase());
}
