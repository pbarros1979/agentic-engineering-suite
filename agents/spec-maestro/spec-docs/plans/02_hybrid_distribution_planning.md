# Plano de Arquitetura & Implementação: Distribuição Híbrida ("All-in-One") da Agentic Engineering Suite

**Status**: Ready for Human Approval (Loss Function)  
**Intent**: Implementar a abordagem híbrida All-in-One de distribuição extensível para todos os agentes da Agentic Engineering Suite (`spec-maestro`, `mcp-engineer` e futuros especialistas), combinando governança física versionada no Git (`spec-docs/`, `.agent/`, regras de assistente) com MCP Server dinâmico modular para projetos novos (Green-Field) e legados (Brown-Field).  
**Pathway**: Green-Field (Pacotes de Distribuição da Suite)  
**Data**: 2026-09-21  
**Autor**: Spec Maestro (`spec-maestro`)  

---

## 1. Visão Geral e Justificativa Estratégica

O ecossistema **Agentic Engineering Suite** reúne agentes especializados em engenharia de software nativa de IA:
1. **`spec-maestro`**: Especialista em Inception, Mob Elaboration, Domain-Driven Design (DDD), pacotes contratuais SDD e auditoria de convergência (**Zero-Code de produção**).
2. **`mcp-engineer`**: Especialista em arquitetura, scaffolding, segurança e testes de servidores MCP (TypeScript/Node.js ESM) e agentes declarativos em Markdown.
3. **Futuros Agentes**: Agentes especialistas planejados para as próximas etapas (ex.: `qa-engineer`, `devops-agent`, `security-auditor`, `refactor-agent`).

Para que qualquer repositório de software possa adotar os agentes da suite de forma modular, flexível e sem fricção, a estratégia de distribuição precisa:

- **Instalação com 1 Comando**: `npx @agentic-suite/cli init` permitindo selecionar toda a suite ou agentes específicos.
- **Arquitetura de Catálogo Extensível (Agent Registry)**: Novos agentes devem ser adicionados ao ecossistema sem necessidade de reescrever a CLI ou o servidor MCP.
- **Suporte Nativo a Repositórios Git Existentes (Brown-Field)**: Operar de forma estritamente não-destrutiva, preservando código legado, branches e arquivos de configuração existentes.
- **Unificação Híbrida (Estático + Dinâmico)**:
  - **Camada Estática (Git)**: Arquivos de documentação em `spec-docs/`, diretório `.agent/` com manifestos/skills e regras unificadas em `AGENTS.md`, `.cursorrules` e `CLAUDE.md`.
  - **Camada Dinâmica (MCP Server Modular)**: Servidor unificado com namespaces desacoplados (`spec_*`, `mcp_*`, etc.), fornecendo ferramentas determinísticas tipadas com Zod, prompts guiados e recursos sob demanda.

---

## 2. Topologia do Monorepo e Arquitetura de Pacotes

```text
agentic-engineering-suite/
├── packages/
│   ├── agentic-suite-mcp/              # Servidor MCP unificado e modular (TypeScript ESM)
│   │   ├── src/
│   │   │   ├── index.ts                # Entrypoint Stdio Server
│   │   │   ├── registry.ts             # Registrador dinâmico de ferramentas e prompts
│   │   │   ├── modules/
│   │   │   │   ├── spec-maestro/       # Tools: spec_init, spec_create_intent, spec_generate_sdd
│   │   │   │   │   ├── tools.ts
│   │   │   │   │   ├── prompts.ts
│   │   │   │   │   └── resources.ts
│   │   │   │   ├── mcp-engineer/       # Tools: mcp_scaffold, mcp_validate, mcp_audit_security
│   │   │   │   │   ├── tools.ts
│   │   │   │   │   ├── prompts.ts
│   │   │   │   │   └── resources.ts
│   │   │   │   └── <future-agent>/     # Novos agentes conectados como plugins modulares
│   │   │   └── utils/
│   │   │       └── safe-fs.ts          # Proteção contra Path Traversal e sandbox
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── agentic-suite-cli/              # CLI de Scaffolding Híbrido e Extensível
│       ├── src/
│       │   ├── cli.ts                  # Entrypoint Commander (init, add, list, update)
│       │   ├── catalog.ts              # Catálogo centralizado de agentes disponíveis
│       │   ├── detect.ts               # Detecção de Git, linguagens e Brown-field
│       │   ├── scaffold.ts             # Injeção física (.agent/ e spec-docs/)
│       │   ├── rules-merger.ts         # Agregação inteligente de AGENTS.md, Cursor e Claude
│       │   └── mcp-merger.ts           # Safe JSON merger para .cursor/mcp.json
│       ├── package.json
│       └── tsconfig.json
│
├── agents/                             # SSOT dos Agentes no Monorepo
│   ├── spec-maestro/
│   └── mcp-engineer/
├── spec-docs/                          # Context memory central
└── AGENTS.md                           # Diretrizes unificadas
```

---

## 3. O Padrão de Catálogo de Agentes (Agent Registry Pattern)

Para permitir a adição contínua de novos agentes sem acoplamento, cada agente é registrado como um módulo declarativo:

```typescript
// packages/agentic-suite-cli/src/catalog.ts
export interface AgentDefinition {
  id: string;                    // ex: 'spec-maestro', 'mcp-engineer'
  name: string;                  // ex: 'Spec Maestro'
  role: string;                  // ex: 'SDLC Planning & Spec Architect'
  description: string;
  category: 'governance' | 'engineering' | 'qa' | 'devops';
  skills: string[];              // ex: ['ai-dlc', 'sdd']
  zeroCode: boolean;             // Flag indicando restrição estrita de código
  mcpNamespace: string;          // ex: 'spec'
  requiresSpecDocs: boolean;
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
  },
  {
    id: "mcp-engineer",
    name: "MCP Engineer",
    role: "MCP Servers & Markdown Agents Specialist",
    description: "Arquitetura, scaffolding, segurança e testes de servidores MCP e agentes declarativos.",
    category: "engineering",
    skills: ["mcp-builder", "mcp-inspector-tester", "security-mcp-guard"],
    zeroCode: false,
    mcpNamespace: "mcp",
    requiresSpecDocs: false,
  },
  // Novos agentes adicionados aqui de forma puramente declarativa!
];
```

---

## 4. Experiência de Uso da CLI Extensível

### A. Instalação Interativa (Novo Projeto ou Projeto Existente)
```bash
npx @agentic-suite/cli init
```

```text
🚀 Agentic Engineering Suite - Setup Híbrido

? Selecione os agentes da suite que deseja habilitar neste projeto:
  ❯ [x] Spec Maestro (Inception, DDD & SDD - Zero-Code)
    [x] MCP Engineer (Servidores MCP & Agentes em Markdown)
    [ ] (Futuros agentes serão listados aqui...)
? Quais assistentes de IA o time utiliza?
  ❯ [x] Cursor
    [x] Antigravity
    [x] Claude Code
? Deseja ativar o servidor MCP unificado (@agentic-suite/mcp-server)? (Y/n) Y

⏳ Injetando governança e agentes selecionados...
   ✓ .agent/agents/spec-maestro.md + skills (ai-dlc, sdd)
   ✓ .agent/agents/mcp-engineer.md + skills (mcp-builder, mcp-inspector-tester, security-mcp-guard)
   ✓ spec-docs/ estrutura completa de governança
   ✓ .cursor/mcp.json configurado com @agentic-suite/mcp-server
   ✓ AGENTS.md, .cursor/rules/ e CLAUDE.md combinados com os papéis de todos os agentes ativos!

🎉 2 agentes instalados e configurados com sucesso!
```

### B. Adicionar um Novo Agente Futuramente em Repositório Existente
Quando um novo agente for lançado (ex.: `qa-engineer`), o time roda:
```bash
npx @agentic-suite/cli add qa-engineer
```
* Injeta apenas a pasta `.agent/agents/qa-engineer.md` e suas skills.
* Atualiza as regras em `AGENTS.md` e `.cursor/rules/` com o novo papel.
* Habilita o namespace `qa_*` no MCP Server sem quebrar o que já existia.

---

## 5. Workflow de Fatiamento (Units & Bolts)

### Bolt 1: Servidor MCP Modular da Suite (`agentic-suite-mcp`)
- [ ] Setup do pacote TypeScript ESM com `@modelcontextprotocol/sdk` e `zod`.
- [ ] Arquitetura de registro modular de ferramentas (`ToolRegistry`), prompts e resources com namespaces isolados.
- [ ] **Módulo `spec-maestro` (Namespace `spec_*`)**:
  - [ ] Tools: `spec_init_workspace`, `spec_create_intent`, `spec_generate_sdd_package`, `spec_audit_convergence`.
  - [ ] Prompts: `spec/mob-elaboration`, `spec/sdd-package`, `spec/audit-convergence`.
  - [ ] Resources: templates de `ai-dlc` e `sdd`.
- [ ] **Módulo `mcp-engineer` (Namespace `mcp_*`)**:
  - [ ] Tools: `mcp_scaffold_server`, `mcp_validate_schema`, `mcp_audit_security`.
  - [ ] Prompts: `mcp/design-server`, `mcp/security-audit`.
  - [ ] Resources: templates de manifesto e sandbox.
- [ ] Testes unitários com Vitest e testes de conformidade com MCP Inspector.

### Bolt 2: Scaffolding CLI Híbrida e Extensível (`agentic-suite-cli`)
- [ ] Setup do pacote CLI com `commander`, `prompts` e `picocolors`.
- [ ] Implementação do `AGENT_REGISTRY` declarativo e plugável.
- [ ] Comandos principais:
  - [ ] `init`: wizard interativo com seleção de agentes e assistentes.
  - [ ] `add <agent-id>`: acoplamento incremental de novo agente em projeto existente.
  - [ ] `list`: listagem de agentes da suite instalados vs. disponíveis.
- [ ] Detecção de repositório Git existente e salvaguardas para projetos Brown-Field.
- [ ] Injetor de regras agregadas (`AGENTS.md`, `.cursor/rules/`, `CLAUDE.md`) com divisão clara de papéis e fronteiras operacionais.
- [ ] Mecanismo de *Safe JSON Merging* para `.cursor/mcp.json` e `.vscode/settings.json`.

### Bolt 3: Testes de Validação, Idempotência e Multi-Agente
- [ ] Teste E2E Full Suite: inicialização com todos os agentes ativos.
- [ ] Teste E2E Modular: inicialização com apenas 1 agente selecionado.
- [ ] Teste E2E Incremental: inicialização com 1 agente e posterior execução de `add` para o segundo agente.
- [ ] Teste Brown-field em repositório Git com código pré-existente e servidores MCP já configurados.
- [ ] Teste de Idempotência e integridade das regras em `AGENTS.md`.

### Bolt 4: Documentação e Publicação
- [ ] Documentar o fluxo de distribuição e o catálogo de agentes no `readme.md`.
- [ ] Atualizar o livro-razão `spec-docs/prompts.md`.
