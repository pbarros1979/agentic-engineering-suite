# spec-docs/specs

Este diretório armazena os pacotes de especificação baseados em **Spec-Driven Development (SDD)** da Microsoft para cada Unit ou funcionalidade do sistema.

Cada pacote SDD é organizado em subdiretórios correspondentes às Units do AI-DLC:

```text
spec-docs/specs/
├── constitution.md             # Constituição global de engenharia do repositório
└── <unit_name>/
    ├── spec.md                 # Especificação funcional e técnica da Unit
    ├── plan.md                 # Plano de arquitetura técnica e contratos de API
    ├── tasks.md                # Lista ordenada de tarefas atômicas com checkboxes [ ]
    └── converge.md             # Relatório de auditoria de conformidade e spec drift
```
