import { ResourceDefinition } from "../../types.js";

const CONSTITUTION_TEMPLATE = `# Feature Constitution: {{featureName}}

## 1. Princípios Inegociáveis & Guardrails
- **Zero-Code de Produção**: O Spec Maestro atua estritamente no planejamento, especificação e contratos. Nenhuma linha de código de produção é gerada aqui.
- **SSOT em Markdown**: A especificação é o contrato final entre os stakeholders e os agentes executores.
- **Rastreabilidade**: Todas as decisões devem estar fundamentadas em requisitos de negócio e registradas em prompts.md.

## 2. Limites de Arquitetura
- **Stack Tecnológica**: Respeitar as convenções do repositório.
- **Sandbox & Segurança**: Nenhuma violação de integridade ou sandbox permitida.
`;

const SPEC_TEMPLATE = `# Feature Specification: {{featureName}}

## 1. Visão Geral & Problema de Negócio
- **Contexto**:
- **Problema a Resolver**:
- **Valor Agregado**:

## 2. Histórias de Usuário & Critérios de Aceite (BDD)
### Story 1:
- **Dado que**:
- **Quando**:
- **Então**:

## 3. Requisitos Não-Funcionais
- Desempenho, resiliência, observabilidade e segurança.
`;

const PLAN_TEMPLATE = `# Tactical Implementation Plan: {{featureName}}

## 1. Decomposição em Bolts
- [ ] **Bolt 1: Fundação & Contratos**
- [ ] **Bolt 2: Implementação Central**
- [ ] **Bolt 3: Testes de Regressão & Integração**
- [ ] **Bolt 4: Documentação & Validação Final**

## 2. Checkpoints de Loss Function Humana
- Checkpoint 1: Aprovação do contrato
- Checkpoint 2: Validação da implementação
`;

const TASKS_TEMPLATE = `# Granular Actionable Tasks: {{featureName}}

- [ ] Task 1.1: Configurar estrutura inicial
- [ ] Task 1.2: Implementar schemas e validação
- [ ] Task 2.1: Implementar handlers de negócio
- [ ] Task 3.1: Escrever testes unitários e de integração
- [ ] Task 4.1: Atualizar documentação e changelog
`;

const CONVERGE_TEMPLATE = `# Convergence & Acceptance Matrix: {{featureName}}

| Requisito / Critério | Status | Evidência de Validação |
| -------------------- | ------ | ---------------------- |
| Testes Automatizados | [ ] Pendente | vitest run |
| Contrato de API      | [ ] Pendente | Validação de Schema |
| Documentação SSOT    | [ ] Pendente | spec-docs/ |
`;

const INTENT_TEMPLATE = `# Intent: {{title}}

**Status**: Ready for Human Approval  
**Intent**: {{intent}}  
**Business Value**: {{businessValue}}  
**Scope**: {{scope}}  

## 1. Contexto & Justificativa
{{context}}

## 2. Objetivos Principais
- [ ] Objetivo 1
- [ ] Objetivo 2

## 3. Plano de Ação Tático
- [ ] Passo 1
- [ ] Passo 2
`;

export const specResources: ResourceDefinition[] = [
  {
    uri: "spec://templates/constitution",
    name: "SDD Constitution Template",
    description: "Template oficial de governança e invariantes de feature SDD",
    mimeType: "text/markdown",
    read: async () => ({
      uri: "spec://templates/constitution",
      mimeType: "text/markdown",
      text: CONSTITUTION_TEMPLATE,
    }),
  },
  {
    uri: "spec://templates/spec",
    name: "SDD Specification Template",
    description: "Template de especificação funcional e critérios BDD",
    mimeType: "text/markdown",
    read: async () => ({
      uri: "spec://templates/spec",
      mimeType: "text/markdown",
      text: SPEC_TEMPLATE,
    }),
  },
  {
    uri: "spec://templates/plan",
    name: "SDD Tactical Plan Template",
    description: "Template tático de decomposição em Bolts com checkboxes",
    mimeType: "text/markdown",
    read: async () => ({
      uri: "spec://templates/plan",
      mimeType: "text/markdown",
      text: PLAN_TEMPLATE,
    }),
  },
  {
    uri: "spec://templates/tasks",
    name: "SDD Granular Tasks Template",
    description: "Template de tarefas acionáveis granulares para executores",
    mimeType: "text/markdown",
    read: async () => ({
      uri: "spec://templates/tasks",
      mimeType: "text/markdown",
      text: TASKS_TEMPLATE,
    }),
  },
  {
    uri: "spec://templates/converge",
    name: "SDD Convergence Matrix Template",
    description: "Template de matriz de validação e critérios de convergência",
    mimeType: "text/markdown",
    read: async () => ({
      uri: "spec://templates/converge",
      mimeType: "text/markdown",
      text: CONVERGE_TEMPLATE,
    }),
  },
  {
    uri: "spec://templates/intent",
    name: "AI-DLC Intent Plan Template",
    description: "Template de intent de negócio e plano tático AI-DLC",
    mimeType: "text/markdown",
    read: async () => ({
      uri: "spec://templates/intent",
      mimeType: "text/markdown",
      text: INTENT_TEMPLATE,
    }),
  },
];
