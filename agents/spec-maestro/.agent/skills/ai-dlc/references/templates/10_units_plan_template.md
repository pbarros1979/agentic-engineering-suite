# Units Plan: [Nome do Intent / Sistema]

**Localização**: `spec-docs/plans/units_plan.md`  
**Status**: [Pending Review / Approved / Executing / Completed]  
**Referência de Entrada**: `spec-docs/story-artifacts/<feature>_user_stories.md`  

---

## 1. Instruções Operacionais
> [!IMPORTANT]
> Este documento é o plano de trabalho para particionar o escopo de histórias em **Units** coesas e desacopladas, além de estimar os **Bolts** de execução rápida. Não avance sem a aprovação explícita do Arquiteto e do Product Owner.

---

## 2. Etapas de Decomposição e Agrupamento

- [ ] **Passo 1: Análise de Coesão e Dependências Funcionais**
  - *Ação*: Mapear as afinidades de dados e fluxos de cada User Story para identificar Bounded Contexts naturais.
  - *Nota de Clarificação*: [Verificar se o processamento de pagamentos deve residir na mesma Unit de pedidos ou em Unit apartada].

- [ ] **Passo 2: Definição dos Limites das Units (Bounded Contexts)**
  - *Ação*: Isolar cada conjunto coeso em uma Unit com responsabilidade única e interface de comunicação definida.
  - *Nota de Clarificação*: [Confirmar padrão de comunicação entre as Units: Síncrono via REST/gRPC ou Assíncrono via Eventos].

- [ ] **Passo 3: Mapeamento de Histórias e Critérios de Aceite por Unit**
  - *Ação*: Alocar cada história de usuário à sua respectiva Unit sem sobreposição de escopo.
  - *Nota de Clarificação*: [Validar se alguma história requer coordenação transacional distribuída (Saga)].

- [ ] **Passo 4: Planejamento e Sequenciamento dos Bolts**
  - *Ação*: Fatiar a construção de cada Unit em ciclos curtos de horas ou poucos dias (Bolts).
  - *Nota de Clarificação*: [Confirmar capacidade de paralelização de desenvolvimento entre Units independentes].

- [ ] **Passo 5: Consolidação dos Documentos de Especificação de Units**
  - *Ação*: Gravar a decomposição em `spec-docs/design-artifacts/<unit>_spec.md` e submeter para aprovação.

---

## 3. Registro de Aprovação (Loss Function)
- **Data da Validação**: [YYYY-MM-DD]
- **Aprovador**: [Software Architect / Tech Lead]
- **Notas de Decisão**: [Registro de deliberações técnicas da sessão]
