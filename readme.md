# Agentic Engineering Suite

Um ecossistema unificado de **Engenharia de Software Nativa de IA (AI-Native Software Engineering)** voltado para governança, orquestração multi-agente, scaffolding determinístico e extensibilidade via protocolo **Model Context Protocol (MCP)**.

[![npm version (CLI)](https://img.shields.io/npm/v/@agentic-engineering-suite/cli.svg?label=%40agentic-engineering-suite%2Fcli)](https://www.npmjs.com/package/@agentic-engineering-suite/cli)
[![npm version (MCP)](https://img.shields.io/npm/v/@agentic-engineering-suite/mcp-server.svg?label=%40agentic-engineering-suite%2Fmcp-server)](https://www.npmjs.com/package/@agentic-engineering-suite/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🎯 Arquitetura de Distribuição Híbrida

A suite adota o paradigma de **Distribuição Híbrida**:
- **Camada Cognitiva (Markdown SSOT)**: Manifestos (`.agent/agents/`), skills operacionais (`.agent/skills/`), contratos formais SDD (`spec-docs/specs/`) e diretrizes agregadas (`AGENTS.md`, `.cursorrules`, `CLAUDE.md`).
- **Camada Determinística Executável (TypeScript / MCP)**: Servidor MCP modular ([`@agentic-engineering-suite/mcp-server`](https://www.npmjs.com/package/@agentic-engineering-suite/mcp-server)) com ferramentas tipadas, validação Zod e isolamento absoluto de Stdio, além da CLI oficial de orquestração ([`@agentic-engineering-suite/cli`](https://www.npmjs.com/package/@agentic-engineering-suite/cli)).

```text
agentic-engineering-suite/
├── packages/
│   ├── agentic-suite-mcp/     # Servidor MCP unificado (@agentic-engineering-suite/mcp-server)
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── spec-maestro/   # Ferramentas spec_* (Init, Intent, SDD, Audit)
│   │   │   │   └── mcp-engineer/   # Ferramentas mcp_* (Scaffold, Validate, Audit)
│   │   │   ├── registry.ts         # Registro plugável de módulos
│   │   │   └── server.ts           # Servidor Stdio / InMemory
│   │   └── tests/                  # Testes Vitest com InMemoryTransport
│   │
│   └── agentic-suite-cli/     # CLI oficial de distribuição (@agentic-engineering-suite/cli)
│       ├── bin/agentic-suite.js    # Executável npx / global
│       ├── src/
│       │   ├── catalog.ts          # AGENT_REGISTRY declarativo
│       │   ├── detect.ts           # Detecção Green-Field vs Brown-Field
│       │   ├── scaffold.ts         # Injeção física (.agent/, skills, spec-docs/)
│       │   ├── rules-merger.ts     # Mesclagem segura e idempotente (AGENTS.md, etc.)
│       │   └── mcp-merger.ts       # Safe JSON Merger (.cursor/mcp.json, etc.)
│       └── tests/                  # Testes E2E, modular, incremental e Brown-Field
│
├── agents/                    # Definições canônicas dos agentes de referência
│   ├── spec-maestro/          # SDLC Planning & Spec Architect (Zero-Code)
│   └── mcp-engineer/          # MCP Servers & Markdown Agents Specialist
│
└── spec-docs/                 # Governança e Context Memory AI-DLC/SDD
    ├── plans/                 # Planos estratégicos e operacionais
    ├── specs/                 # Contratos SDD de features
    └── prompts.md             # Livro-razão cronológico de decisões
```

---

## 👥 Catálogo de Agentes Especialistas

| Agente | Role | Categoria | Zero-Code | Namespace MCP | Skills Incorporadas |
|---|---|---|:---:|:---:|---|
| **Spec Maestro** (`spec-maestro`) | SDLC Planning & Spec Architect | Governança | Sim (Estrito) | `spec_*` | `ai-dlc`, `sdd` |
| **MCP Engineer** (`mcp-engineer`) | MCP Servers & Agentic Specialist | Engenharia | Não (Código) | `mcp_*` | `mcp-builder`, `mcp-inspector-tester`, `security-mcp-guard` |

---

## 📦 Instalação e Execução via NPM

Você não precisa clonar este monorepo para utilizar a suite nos seus projetos. O pacote da CLI é executável instantaneamente via `npx` ou instalável globalmente.

### Execução Imediata (Sem Instalação)
```bash
npx @agentic-engineering-suite/cli init
```

### Instalação Global (Opcional)
```bash
npm install -g @agentic-engineering-suite/cli
agentic-suite init
```

---

## 🚀 Guia de Uso da CLI (`@agentic-engineering-suite/cli`)

### 1. Inicialização Interativa (Assistente Visual)
Em qualquer repositório existente (Brown-Field) ou projeto do zero (Green-Field):
```bash
cd meu-projeto
npx @agentic-engineering-suite/cli init
```

O assistente solicitará:
1. Quais agentes ativar (`spec-maestro`, `mcp-engineer`, etc.);
2. Quais assistentes de IA o time utiliza (Cursor, Antigravity, Claude Code, VS Code);
3. Se deseja habilitar o servidor MCP unificado.

### 2. Inicialização Não-Interativa (Exemplos Práticos)

#### Exemplo A: Setup Completo com Flags Padrão (CI/CD ou Rápido)
```bash
npx @agentic-engineering-suite/cli init ./meu-projeto-java --yes
```

#### Exemplo B: Setup Apenas para Governança e Especificação (Zero-Code)
Para repositórios onde o time quer apenas o arquiteto de especificações sem MCP:
```bash
npx @agentic-engineering-suite/cli init --agents spec-maestro --no-mcp
```

#### Exemplo C: Especificando Assistentes Alvo
```bash
npx @agentic-engineering-suite/cli init --agents spec-maestro mcp-engineer --assistants cursor antigravity
```

### 3. Incorporação Incremental de Novos Agentes (`add`)
Adicione novos agentes a um projeto já inicializado sem sobrescrever ou perder suas customizações prévias:
```bash
npx @agentic-engineering-suite/cli add mcp-engineer
```

### 4. Diagnóstico de Governança e Saúde (`status`)
Verifique o estado da suite, repositório e assistentes configurados:
```bash
npx @agentic-engineering-suite/cli status
```
Exemplo de saída:
```text
🩺 Diagnóstico de Governança da Suite
Diretório: C:\Desenv\Git\ExemploJava
Repositório Git: Detectado
Modo: Brown-Field (Legado)
Context Memory (spec-docs/): Ativa
Servidor MCP configurado: Sim (.cursor/mcp.json)

Agentes Instalados: spec-maestro, mcp-engineer
Skills Instaladas: ai-dlc, sdd, mcp-builder, mcp-inspector-tester, security-mcp-guard

Assistentes Detectados:
  Cursor: ✓
  Antigravity: ✓
  Claude Code: ✓
  VS Code: ✓
```

### 5. Catálogo de Agentes Disponíveis (`list`)
Exibe a relação completa de agentes instalados versus disponíveis no catálogo:
```bash
npx @agentic-engineering-suite/cli list
```

---

## ⚡ Como Usar o Servidor MCP nos Assistentes de IA

Ao executar o `init` com MCP ativado, a CLI gera automaticamente a configuração para o Cursor (`.cursor/mcp.json`) e para o VS Code (`.vscode/settings.json`):

```json
{
  "mcpServers": {
    "agentic-suite": {
      "command": "npx",
      "args": ["-y", "@agentic-engineering-suite/mcp-server"]
    }
  }
}
```

### Como a IA interage com o MCP na conversa:

1. **Abertura do Projeto:** A IDE (Cursor, VS Code, Claude Code ou Antigravity) inicia o `@agentic-engineering-suite/mcp-server` em segundo plano via Stdio.
2. **Disponibilidade das Ferramentas:** O modelo de IA recebe automaticamente o catálogo de tools tipadas:
   - **`spec_init_workspace`**: Inicializa a estrutura de diretórios `spec-docs/` e o livro-razão `prompts.md`.
   - **`spec_create_intent`**: Cria um novo plano de intent numerado (`spec-docs/plans/NN_<intent>.md`) e registra no histórico.
   - **`spec_generate_sdd_package`**: Gera o pacote contratual com os 5 arquivos canônicos (`constitution.md`, `spec.md`, `plan.md`, `tasks.md`, `converge.md`).
   - **`spec_audit_convergence`**: Audita o progresso de tarefas concluídas vs. pendentes e calcula a taxa de convergência.
   - **`mcp_scaffold_server`**: Cria a estrutura completa de um novo servidor MCP em TypeScript ESM com Zod, isolamento de Stdio e testes Vitest.
   - **`mcp_validate_schema`**: Valida arquivos de servidores MCP contra violações de Stdio (`console.log`), tipagem Zod e respostas com `isError: true`.
   - **`mcp_audit_security`**: Audita potenciais vulnerabilidades de Path Traversal, injeção de comandos de terminal e vazamento de segredos.
3. **Exemplo de Interação no Chat:**
   > **Usuário:** *"Spec Maestro, inicie o planejamento de uma feature para autenticação JWT nesta aplicação."*  
   > **Assistente:** Invoca deterministicamente a ferramenta `spec_create_intent` do MCP e apresenta o arquivo gerado em `spec-docs/plans/` solicitando a validação humana (*Human Loss Function*).

### Inspecionar Ferramentas Visualmente (MCP Inspector)
Para inspecionar os esquemas JSON das ferramentas, testar chamadas e verificar recursos sem abrir a IDE:
```bash
npx @modelcontextprotocol/inspector npx @agentic-engineering-suite/mcp-server
```

---

## 🛡️ Salvaguardas para Projetos Brown-Field

1. **Mesclagem Idempotente**: O `rules-merger` delimita as regras injetadas com âncoras como `<!-- BEGIN AGENTIC-SUITE: <ID> -->` e `<!-- END AGENTIC-SUITE: <ID> -->`. Nenhuma regra proprietária do usuário é sobrescrita ou duplicada.
2. **Safe JSON Merging**: Modificações em `.cursor/mcp.json` e `.vscode/settings.json` preservam chaves, propriedades e outros servidores MCP preexistentes.
3. **Sandbox do Servidor MCP**: Todas as operações de leitura e escrita do servidor passam por `resolveSafePath`, impedindo qualquer tentativa de fuga do diretório raiz via Path Traversal.

---

## 🧪 Desenvolvimento e Contribuição no Monorepo

O monorepo utiliza npm workspaces e Vitest:

```bash
# Instalar dependências de todos os pacotes
npm install

# Compilar todos os pacotes (TypeScript ESM)
npm run build

# Executar a suíte de 36 testes automatizados (unitários, integração e E2E InMemory)
npm test
```

### Publicação no NPM (Mantenedores)

```bash
# Compilar e publicar a CLI
cd packages/agentic-suite-cli
npm publish --access public

# Compilar e publicar o Servidor MCP
cd ../agentic-suite-mcp
npm publish --access public
```

---

## 📄 Licença

Distribuído sob a licença **MIT**. Consulte `LICENSE` para mais detalhes.
