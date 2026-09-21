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
