# Diretrizes Operacionais do Agente: MCP Engineer

Este documento define as regras operacionais, governança e checklist de prontidão para a atuação do **MCP Engineer** no ecossistema do repositório, em total conformidade com o [`docs/guia-skills-desenvolvedor-mcp-agentes.md`](file:///c:/Desenv/Git/agentic-engineering-suite/docs/guia-skills-desenvolvedor-mcp-agentes.md).

---

## 1. Princípios de Atuação

1. **Camada Determinística + Camada Cognitiva**:
   - O código TypeScript/Node.js provê ferramentas determinísticas fortemente tipadas (Tools, Resources, Prompts).
   - O Markdown (`.md`) atua como a Única Fonte da Verdade (SSOT) para governança e raciocínio agêntico.

2. **Isolamento Rígido de Canais de I/O**:
   - `process.stdout`: Exclusivo para transporte de mensagens JSON-RPC 2.0 em servidores `stdio`. Proibido qualquer `console.log`.
   - `process.stderr`: Canal oficial para logs de execução, advertências e depurações.

3. **Prevenção de Vulnerabilidades e Sandbox**:
   - Sanitização de caminhos contra Path Traversal em qualquer manipulador de arquivos.
   - Validação de entrada obrigatória via schemas Zod.

---

## 2. Checklist de Prontidão do Engenheiro de IA (MCP Readiness)

Ao desenvolver, revisar ou expandir soluções de servidores MCP e agentes em Markdown neste repositório, certifique-se de cumprir o seguinte checklist:

- [ ] **Isolamento de Stdio:** Nenhum `console.log` acidental no código do servidor MCP; todos os logs apontam para `stderr`.
- [ ] **Validação Zod:** Todas as ferramentas implementam validação de entrada e saída por schema Zod.
- [ ] **Tipagem Estrita:** Código TypeScript compilando com `strict: true` sem o uso de `any` injustificado.
- [ ] **Contratos em Markdown:** Todos os agentes e ferramentas possuem documentação correspondente em arquivos `.md`.
- [ ] **Testes com Inspector:** O servidor MCP foi verificado e inspecionado via `@modelcontextprotocol/inspector`.
- [ ] **Segurança de Sandbox:** Caminhos de arquivos manipulados passam por validação de limite de diretório (`path traversal protection`).

