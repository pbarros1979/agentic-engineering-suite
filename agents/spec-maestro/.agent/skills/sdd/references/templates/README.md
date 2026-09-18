# Catálogo de Templates SDD (Spec-Driven Development)

Este diretório contém a suite completa de templates padronizados da metodologia **Spec-Driven Development (SDD)** concebida pela Microsoft (*Apoorv Gupta / GitHub Spec Kit*).

---

## Cadeia de Artefatos SDD

```text
spec-docs/specs/<unit>/
├── constitution.md             # Regras invariantes de engenharia, restrições de stack e padrões
├── spec.md                     # Requisitos funcionais, cenários de usuário e critérios de aceitação (O Quê e Por Quê)
├── plan.md                     # Arquitetura técnica, contratos de endpoints, diagramas e trade-offs (Como)
├── tasks.md                    # Decomposição em tarefas atômicas sequenciais com checkboxes [ ] para o Coding Agent
└── converge.md                 # Auditoria pós-implementação de conformidade e eliminação de Spec Drift
```

---

## Relação de Templates Disponíveis

| Template | Artefato Gerado | Papel no Ciclo SDD |
|---|---|---|
| [`constitution_template.md`](constitution_template.md) | `constitution.md` | Guardrails invariantes do projeto, padrões de código, segurança e stack. |
| [`spec_template.md`](spec_template.md) | `spec.md` | O quê e o porquê: cenários de usuário, inputs/outputs e critérios de aceite. |
| [`plan_template.md`](plan_template.md) | `plan.md` | Arquitetura técnica, contratos de endpoints, diagramas e trade-offs. |
| [`tasks_template.md`](tasks_template.md) | `tasks.md` | Tarefas sequenciais atômicas com checkboxes `[ ]` para execução determinística por agentes de codificação. |
| [`converge_template.md`](converge_template.md) | `converge.md` | Verificação de conformidade do código contra a spec, eliminando alucinações e drift. |
