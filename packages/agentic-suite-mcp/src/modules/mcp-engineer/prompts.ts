import { PromptDefinition } from "../../types.js";

export const mcpPrompts: PromptDefinition[] = [
  {
    name: "mcp/design-server",
    description: "Guia arquitetural para concepção e design de novos servidores MCP resilientes",
    arguments: [
      {
        name: "serverName",
        description: "Nome do servidor MCP (ex.: git-tools, database-explorer)",
        required: true,
      },
      {
        name: "capabilities",
        description: "Quais capabilities planeja implementar: tools, resources, prompts",
        required: false,
      },
    ],
    handler: async (args) => {
      const serverName = args.serverName || "custom-mcp-server";
      const capabilities = args.capabilities || "tools";

      return {
        description: "Design Arquitetural de Servidor MCP",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Atue como **MCP Engineer** (Model Context Protocol & Markdown Agents Specialist) e desenhe a arquitetura do servidor MCP "${serverName}".\n\n` +
                `**Capabilities planejadas**: ${capabilities}\n\n` +
                `### Requisitos Inegociáveis do MCP Engineer:\n` +
                `1. **Isolamento de Stdio**: O canal \`process.stdout\` pertence exclusivamente ao JSON-RPC 2.0. Jamais utilize \`console.log\`.\n` +
                `2. **Validação com Zod**: Todo argumento recebido deve passar por parsing estrito de schema Zod.\n` +
                `3. **Tratamento Defensivo**: Retorne sempre \`isError: true\` no payload estruturado para que a LLM possa se autocorrigir.\n` +
                `4. **Sandbox & Safe-FS**: Proteja o sistema contra Path Traversal sanitizando caminhos.\n` +
                `5. **TypeScript ESM Moderno**: Target ES2022, NodeNext, strict: true.\n\n` +
                `Apresente a especificação das tools, schemas Zod correspondentes e a estrutura de pastas proposta.`,
            },
          },
        ],
      };
    },
  },
  {
    name: "mcp/security-audit",
    description: "Roteiro de auditoria estática e de segurança para servidores MCP",
    arguments: [
      {
        name: "serverPath",
        description: "Caminho do código-fonte do servidor MCP a ser auditado",
        required: true,
      },
    ],
    handler: async (args) => {
      const serverPath = args.serverPath || "./src";

      return {
        description: "Auditoria de Segurança para Servidores MCP",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Atue como **MCP Engineer** com a skill \`security-mcp-guard\` e realize uma auditoria rigorosa de segurança no servidor MCP localizado em "${serverPath}".\n\n` +
                `### Vetores Obrigatórios de Análise:\n` +
                `1. **Path Traversal**: Há chamadas a \`fs.readFile\`, \`fs.writeFile\` sem validação por \`resolveSafePath\`?\n` +
                `2. **Poluição de Stdio**: Há ocorrência de \`console.log\` que possa corromper o fluxo JSON-RPC?\n` +
                `3. **Command Injection**: Há execução de shell arbitrário via \`exec\` ou parâmetros não sanitizados?\n` +
                `4. **Vazamento de Dados Sensíveis**: Há exposição de variáveis de ambiente, tokens ou caminhos absolutos do host em mensagens de erro?\n` +
                `5. **Tratamento de Exceções**: As falhas retornam \`isError: true\` estruturado ou derrubam o processo?\n\n` +
                `Gere o parecer final com score de conformidade e itens de remediação imediata.`,
            },
          },
        ],
      };
    },
  },
];
