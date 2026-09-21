# Plano de Arquitetura & Especificação: Agente Especializado `mcp-engineer`

**Status**: Completed (Arquitetado e Implementado)  
**Intent**: Criação e integração do agente especializado em Servidores MCP (Model Context Protocol) e Agentes em Markdown, conforme `docs/guia-skills-desenvolvedor-mcp-agentes.md`.  
**Pathway**: Green-Field (Novo Agente Modular)  
**Data**: 2026-09-19  
**Autor**: Spec Maestro (`spec-maestro`)  

---

## 1. Alinhamento Estratégico & Escopo

- **Objetivo Primário**: Equipar o ecossistema `agentic-engineering-suite` com um especialista de execução em TypeScript/Node.js ESM para construção de servidores MCP modulares e orquestração de agentes declarativos em Markdown.
- **Padrão Canônico de Armazenamento**: Seguir fielmente a anatomia desacoplada de [`agents/spec-maestro/`](file:///c:/Desenv/Git/agentic-engineering-suite/agents/spec-maestro), mantendo manifesto, skills, regras operacionais e context memory sob `agents/mcp-engineer/`.
- **Restrições Arquiteturais Rígidas**:
  - Isolamento mandatário de `stdout` em servidores MCP que operam com `stdio` (logs unicamente via `stderr`).
  - Validação estrita em runtime via `Zod`.
  - Tratamento defensivo de erros com retorno de payload `isError: true`.
  - Proteção contra *Path Traversal* e garantia de sandbox de diretórios.

---

## 2. Decomposição Estrutural do Agente (`agents/mcp-engineer/`)

```text
agents/mcp-engineer/
├── .agent/
│   ├── agents/
│   │   └── mcp-engineer.md                 # Manifesto do especialista
│   └── skills/
│       ├── mcp-builder/
│       │   └── SKILL.md                    # Scaffolding de servidores MCP TS/ESM
│       ├── mcp-inspector-tester/
│       │   └── SKILL.md                    # Testes Vitest e MCP Inspector
│       └── security-mcp-guard/
│           └── SKILL.md                    # Prevenção de Path Traversal e sandbox
├── AGENTS.md                               # Diretrizes locais & Checklist de Prontidão
└── spec-docs/                              # Context Memory dedicada do agente
    ├── extensions/README.md                # Especificações de servidores MCP
    ├── plans/README.md                     # Planos técnicos de ferramentas
    └── prompts.md                          # Livro-razão cronológico do mcp-engineer
```

---

## 3. Workflow de Fatiamento (Units & Bolts)

### Bolt 1: Elaboração e Manifesto do Agente
- [x] Definição de papel, persona e escopo de atuação em `agents/mcp-engineer/.agent/agents/mcp-engineer.md`.
- [x] Formalização da arquitetura em duas camadas (Camada Cognitiva em Markdown + Camada Determinística em TypeScript/Node.js).

### Bolt 2: Suite de Skills Especializadas
- [x] Implementação da skill `mcp-builder` com SDK oficial, schemas Zod e transportes Stdio/SSE.
- [x] Implementação da skill `mcp-inspector-tester` para testes de conformidade JSON-RPC e validação via Inspector.
- [x] Implementação da skill `security-mcp-guard` com função canônica `resolveSafePath` contra Path Traversal.

### Bolt 3: Governança Local e Context Memory
- [x] Redação de `agents/mcp-engineer/AGENTS.md` com o Checklist de Prontidão do Engenheiro de IA.
- [x] Inicialização de `agents/mcp-engineer/spec-docs/prompts.md` e pastas de histórico.

### Bolt 4: Integração Global no Workspace
- [x] Registro da pasta de skills em `.agent/skills.json`.
- [x] Atualização de `AGENTS.md` catalogando o papel de `mcp-engineer`.
- [x] Atualização da árvore de diretórios em `readme.md`.
- [x] Registro no livro-razão central `spec-docs/prompts.md`.

