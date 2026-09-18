# Diretrizes Operacionais do Repositório: Engenharia de Software Nativa de IA (AI-Native Software Engineering)

Este repositório adota uma metodologia unificada de **Engenharia de Software Orientada por Inteligência Artificial**, combinando as melhores práticas do **AI-Driven Development Lifecycle (AI-DLC)** e do **Spec-Driven Development (SDD)** para criar um fluxo de trabalho estruturado, auditável e livre de ambiguidades.

Todos os agentes, subagentes e desenvolvedores que operam neste projeto devem aderir estritamente às seguintes diretrizes:

---

## 1. Fundamentos da Engenharia de IA

A engenharia de software nativa de IA neste repositório apoia-se em dois pilares metodológicos complementares:

- **AI-DLC (AI-Driven Development Lifecycle - AWS / Raja SP)**: Estrutura o ciclo de vida do projeto a partir da intenção de negócio, utilizando sessões de *Mob Elaboration*, fatiamento em *Units & Bolts*, modelagem *Domain-Driven Design (DDD)* e validação contínua através da *Loss Function Humana*.
- **SDD (Spec-Driven Development - Microsoft / Apoorv Gupta)**: Estabelece a especificação formal como a *Única Fonte da Verdade (SSOT)* antes da escrita de qualquer linha de código, estruturando o desenvolvimento em pacotes técnicos rigorosos (`constitution`, `spec`, `plan`, `tasks` e auditoria de convergência `converge`).

---

## 2. Princípios em Ação

1. **Reversão de Diálogo (Dialogue Inversion)**: Ao receber uma intenção de negócio ou técnica, o agente não assume premissas; conduz perguntas ativas e estruturadas para eliminar ambiguidades antes de propor soluções.
2. **Loss Function Humana (Aprovação Iterativa)**: Nenhuma arquitetura, especificação ou plano avança para execução sem submeter um plano detalhado com caixas de seleção `[ ]` para revisão e aprovação explícita do desenvolvedor humano.
3. **Spec-First & DDD como SSOT**: O modelo de domínio (DDD) e as especificações técnicas (SDD) governam estritamente o comportamento do sistema. O código executável é uma consequência determinística da especificação.
4. **Bolts e Tarefas Atômicas**: Substituição de sprints tradicionais por **Bolts** de iteração rápida (horas ou poucos dias), divididos em tarefas atômicas sequenciais e autocontidas dentro de **Units** desacopladas.
5. **Prevenção de Spec Drift (Convergência)**: O código implementado deve convergir fielmente com a especificação original. Qualquer divergência exige auditoria formal e atualização da especificação.
6. **Context Memory Centralizada**:
   - Planos e Fatiamento -> `spec-docs/plans/`
   - Requisitos de Negócio & PRFAQ -> `spec-docs/requirements/`
   - User Stories, NFRs e Riscos -> `spec-docs/story-artifacts/`
   - DDD, Arquitetura Lógica & ADRs -> `spec-docs/design-artifacts/`
   - Pacotes de Especificação SDD (Units) -> `spec-docs/specs/`
   - Livro-Razão de Auditoria e Decisões -> `spec-docs/prompts.md`

---

## 3. Divisão de Papéis e Especialistas

Para garantir governança e qualidade arquitetural, as responsabilidades de especificação e desenvolvimento são estritamente segregadas:

- **Spec Maestro (`spec-maestro`)**:
  - **Foco**: Planejamento, requisitos, arquitetura lógica, DDD e geração de pacotes SDD (`spec.md`, `plan.md`, `tasks.md`, `converge.md`).
  - **Fronteira Rígida**: Atua **estritamente em documentação, arquitetura e especificações**. **NUNCA implementa código de produção**.
  - **Skills Utilizadas**: [`ai-dlc`](file:///.agent/skills/ai-dlc/SKILL.md) e [`sdd`](file:///.agent/skills/sdd/SKILL.md).
  - **Referência**: [spec-maestro.md](file:///.agent/agents/spec-maestro.md).

- **Coding Agents (Agentes de Codificação)**:
  - **Foco**: Leitura dos pacotes de especificação em `spec-docs/specs/` e implementação fiel das tarefas atômicas descritas em `tasks.md`.
  - **Fronteira Rígida**: Não alteram escopo, arquitetura ou modelo de domínio sem retorno ao *Spec Maestro* e aprovação humana.
