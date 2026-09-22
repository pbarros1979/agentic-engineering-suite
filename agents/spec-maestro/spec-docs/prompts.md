# AI-DLC Prompts & Decisions Ledger

Este arquivo registra o histórico cronológico de comandos, decisões arquiteturais e checkpoints de aprovação humana da metodologia AI-DLC praticada neste repositório.

---

## Sessão Inicial: Configuração do AI-DLC Specialist e Framework

- **Data**: 2026-09-17
- **Ação**: Inicialização do repositório no padrão metodológico *AI-Driven Development Lifecycle (AI-DLC)*.
- **Artefatos Criados**:
  - Skill `ai-dlc` em `.agent/skills/ai-dlc/` (com handbook de prompts, guias de DDD e catálogo completo de 20 templates de artefatos).
  - Agente `ai_dlc_specialist` registrado e documentado em `.agent/agents/ai-dlc-specialist.md`.
  - Estrutura de Context Memory `spec-docs/` com subdiretórios padronizados (`plans/`, `requirements/`, `story-artifacts/`, `design-artifacts/`).
  - Diretrizes operacionais `AGENTS.md` na raiz do workspace.
- **Ajuste de Estrutura**: Consolidação na pasta singular `.agent/` e remoção de `.agents/` duplicada.
- **Expansão de Templates**: Implementação integral dos 20 templates oficiais abrangendo as 3 fases, o Apêndice A, elevação semântica (Brown-Field), planos táticos com checkboxes, validação de testes e playbooks de observabilidade.
- **Numeração Cronológica**: Todos os 20 templates foram prefixados e ordenados cronologicamente de `00_` a `19_` refletindo a sequência real de execução do ciclo de vida.
- **Integração de Spec-Driven Development (SDD)**: Incorporação do framework da Microsoft (Apoorv Gupta / GitHub Spec Kit), incluindo guia em `references/sdd_framework_guide.md`, suite de 5 templates SDD (`constitution.md`, `spec.md`, `plan.md`, `tasks.md`, `converge.md`) e criação do diretório `spec-docs/specs/`.
- **Reforço de Fronteira (Planning & Spec Only)**: Eliminação de templates e diretrizes de geração de código (ex.: remoção de `15_code_generation_plan_template.md`), delimitando formalmente que a atuação é **exclusivamente na documentação, planejamento e especificações**; a implementação em código-fonte é responsabilidade de executores de desenvolvimento.
- **Renomeação do Agente**: Agente rebatizado oficialmente como **`spec-maestro`** (*Spec Maestro*), com documentação em `.agent/agents/spec-maestro.md`.
- **Separação Modular em Duas Skills**:
  - Skill **`ai-dlc`** (`.agent/skills/ai-dlc/`): Focada 100% no framework de ciclo de vida da AWS (Raja SP), Mob Elaboration, Units, Bolts, DDD e os 19 templates de planejamento e arquitetura.
  - Skill **`sdd`** (`.agent/skills/sdd/`): Focada 100% no framework Spec-Driven Development da Microsoft (Apoorv Gupta / GitHub Spec Kit), englobando Constitution, Spec, Plan, Tasks e Converge.
  - O agente **`spec-maestro`** unifica a operação de ambas as skills mantendo a fronteira de **zero código de produção**.
- **Atualização do AGENTS.md (Engenharia de Software Nativa de IA)**:
  - Diretrizes operacionais expandidas de AI-DLC específico para uma metodologia holística de **Engenharia de Software Nativa de IA (AI-Native Software Engineering)**.
  - Formalização dos dois pilares metodológicos (AI-DLC AWS + SDD Microsoft) e clara segregação entre o **Spec Maestro** (planejamento/especificação) e os executores de implementação de código.
- **Alinhamento da Context Memory (`spec-docs/`)**:
  - Diretório raiz de documentação renomeado de `aidlc-docs/` para `spec-docs/`, refletindo a centralidade da especificação e o papel unificado de engenharia de software nativa de IA do `spec-maestro`.
  - Atualizadas todas as referências em templates, skills (`ai-dlc`, `sdd`), `AGENTS.md` e subdiretórios (`spec-docs/plans/`, `requirements/`, `story-artifacts/`, `design-artifacts/`, `specs/`).
- **Status**: Pronto para recebimento de Intents de negócio/técnicos para início da fase de Inception (Mob Elaboration) e geração de especificações SDD pelo Spec Maestro.

---

## Sessão: Criação do Agente Especializado MCP Engineer (`mcp-engineer`)

- **Data**: 2026-09-19
- **Ação**: Criação e incorporação do especialista em Servidores MCP e Agentes em Markdown, orientado pelas diretrizes de `docs/guia-skills-desenvolvedor-mcp-agentes.md`.
- **Padrão Utilizado**: Replicada fielmente a estrutura desacoplada sob `agents/mcp-engineer/` (`.agent/agents/`, `.agent/skills/`, `AGENTS.md`, `spec-docs/`).
- **Artefatos Criados**:
  - `agents/mcp-engineer/.agent/agents/mcp-engineer.md`: Manifesto do agente com guardrails, stack TypeScript/Node.js ESM, isolamento obrigatório de stdout e tratamento defensivo `isError: true`.
  - `agents/mcp-engineer/.agent/skills/mcp-builder/SKILL.md`: Skill para scaffolding de servidores MCP com `@modelcontextprotocol/sdk` e validação Zod.
  - `agents/mcp-engineer/.agent/skills/mcp-inspector-tester/SKILL.md`: Skill de conformidade JSON-RPC e testes com `@modelcontextprotocol/inspector` e Vitest.
  - `agents/mcp-engineer/.agent/skills/security-mcp-guard/SKILL.md`: Skill de proteção contra Path Traversal e sandbox de ferramentas.
  - `agents/mcp-engineer/AGENTS.md`: Diretrizes locais com Checklist de Prontidão do Engenheiro de IA.
  - `agents/mcp-engineer/spec-docs/`: Context memory dedicada (`prompts.md`, `extensions/`, `plans/`).
- **Integração Global**:
  - `.agent/skills.json`: Adicionado `"agents/mcp-engineer/.agent/skills"`.
  - `AGENTS.md`: Registrado `mcp-engineer` no catálogo de especialistas.
  - `readme.md`: Atualizada a árvore de diretórios.
- **Status**: Agente pronto para construir servidores MCP e orquestrar agentes declarativos em Markdown.

---

## Sessão: Planejamento da Distribuição Híbrida All-in-One da Agentic Engineering Suite

- **Data**: 2026-09-21
- **Ação**: Elaboração e expansão do plano arquitetural e de implementação para distribuição unificada de **todos os agentes** da `agentic-engineering-suite` (`spec-maestro`, `mcp-engineer` e catálogo extensível de futuros especialistas).
- **Metodologia**: Abordagem híbrida ("All-in-One") integrando governança física versionada no Git (`spec-docs/`, `.agent/`, regras de assistente) com ferramentas dinâmicas via servidor MCP modular (`@agentic-suite/mcp-server`) e CLI extensível com catálogo de agentes (`@agentic-suite/cli`).
- **Artefatos Criados / Atualizados**:
  - `spec-docs/plans/02_hybrid_distribution_planning.md`: Plano técnico abrangendo arquitetura de Catálogo de Agentes (Agent Registry), suporte a projetos Green-Field e Brown-Field, comandos `init`, `add` e `list`, e decomposição em 4 Bolts.
- **Status**: Planejamento concluído e aprovado.

---

## Sessão: Implementação da Distribuição Híbrida (02_hybrid_distribution_planning)

- **Data**: 2026-09-22
- **Ação**: Implementação técnica integral dos 4 Bolts do plano `02_hybrid_distribution_planning.md` conduzida sob a tutela do **MCP Engineer**:
  1. **Configuração de Monorepo & Workspaces**:
     - Configurado `package.json` raiz com npm workspaces (`packages/*`).
     - Atualizado `.gitignore` com exclusões de builds Node (`node_modules`, `dist`, `coverage`, `*.tsbuildinfo`).
  2. **Bolt 1 - Servidor MCP Modular (`packages/agentic-suite-mcp`)**:
     - Implementado utilitário `safe-fs.ts` com proteção estrita contra Path Traversal (`resolveSafePath`).
     - Implementado `ToolRegistry` plugável com namespaces isolados.
     - Implementado módulo `spec-maestro` com ferramentas `spec_init_workspace`, `spec_create_intent`, `spec_generate_sdd_package`, `spec_audit_convergence`, prompts (`spec/mob-elaboration`, etc.) e resources (`spec://templates/*`).
     - Implementado módulo `mcp-engineer` com ferramentas `mcp_scaffold_server`, `mcp_validate_schema`, `mcp_audit_security`, prompts (`mcp/design-server`, etc.) e resources (`mcp://templates/*`).
     - Servidor com isolamento rigoroso de `stdout` (somente JSON-RPC 2.0; logs via `console.error`), validação Zod e respostas estruturadas `isError: true`.
     - Entrypoint Stdio e factory `createMcpServer`.
  3. **Bolt 2 - CLI de Scaffolding Híbrida e Extensível (`packages/agentic-suite-cli`)**:
     - Implementado `AGENT_REGISTRY` declarativo e plugável (`catalog.ts`) com `spec-maestro` e `mcp-engineer`.
     - Implementado detector de ambiente `detect.ts` para projetos Green-Field e repositórios Git Brown-Field.
     - Implementado `rules-merger.ts` idempotente e não-destrutivo com âncoras de comentários para `AGENTS.md`, `.cursorrules`, `.cursor/rules/agentic-suite.mdc` e `CLAUDE.md`.
     - Implementado `mcp-merger.ts` com Safe JSON Merging para `.cursor/mcp.json` e `.vscode/settings.json`.
     - Implementado módulo de scaffolding `scaffold.ts` injetando manifestos `.agent/agents/`, skills `.agent/skills/`, `.agent/skills.json` e `spec-docs/`.
     - Comandos implementados com Commander, `@inquirer/prompts` e `picocolors`: `init`, `add <agentId>`, `list`, `status`.
  4. **Bolt 3 - Testes Automatizados Vitest & E2E**:
     - 18 testes para `@agentic-suite/mcp-server` (sandbox safe-fs, registro de ferramentas, módulos spec e mcp, e suite E2E com `Client` e `InMemoryTransport`).
     - 18 testes para `@agentic-suite/cli` (catálogo, detecção de ambiente, rules-merger, safe JSON merger, scaffolding E2E full suite, modular, incremental e Brown-Field).
     - Total: 36 testes passando com 100% de sucesso.
  5. **Bolt 4 - Documentação & Livro-Razão**:
     - Atualizado `readme.md` com arquitetura híbrida, catálogo de agentes, guia de CLI, ferramentas MCP e salvaguardas Brown-Field.
     - Atualizado `spec-docs/plans/02_hybrid_distribution_planning.md` marcando todos os itens dos 4 Bolts como concluídos.
- **Status**: Implementação concluída com sucesso. Sistema pronto para distribuição e uso.
