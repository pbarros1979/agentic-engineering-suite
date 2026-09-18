# Component Model Plan: [Nome da Unit]

**Localização**: `spec-docs/plans/component_model_plan.md`  
**Status**: [Pending Review / Approved / Executing / Completed]  
**Referência de Entrada**: `spec-docs/story-artifacts/<unit>_user_stories.md`  

---

## 1. Instruções Operacionais
> [!IMPORTANT]
> Este plano define as etapas necessárias para modelar os componentes puros de domínio que implementarão todas as User Stories da Unit. Não gere nenhum código nesta etapa. Execute somente após aprovação do Arquiteto / Tech Lead.

---

## 2. Etapas de Modelagem de Componentes

- [ ] **Passo 1: Identificação de Entidades e Atributos de Domínio**
  - *Ação*: Extrair do vocabulário ubíquo as entidades centrais e seus atributos invariantes.
  - *Nota de Clarificação*: [Verificar quais atributos são mutáveis e quais devem ser imutáveis (Value Objects)].

- [ ] **Passo 2: Definição dos Limites de Agregados (Aggregate Roots)**
  - *Ação*: Estabelecer as regras de fronteira e consistência transacional do agregador raiz.
  - *Nota de Clarificação*: [Confirmar se operações no agregador exigem lock pessimista ou concorrência otimista].

- [ ] **Passo 3: Mapeamento de Comportamentos de Negócio e Métodos**
  - *Ação*: Definir métodos que expressam comportamentos da regra de negócio (evitando modelos anêmicos).
  - *Nota de Clarificação*: [Validar se o cálculo de penalidade ou desconto é de domínio ou serviço externo].

- [ ] **Passo 4: Definição dos Eventos de Domínio e Contratos de Repositório**
  - *Ação*: Mapear eventos disparados para mudanças de estado e interfaces de persistência agnóstica.
  - *Nota de Clarificação*: [Verificar se o barramento de eventos requer garantia de entrega at-least-once ou exactly-once].

- [ ] **Passo 5: Elaboração dos Diagramas Estático e Dinâmico do Componente**
  - *Ação*: Construir diagramas de classes e sequências Mermaid para os casos de uso principais.

- [ ] **Passo 6: Consolidação da Especificação em `spec-docs/design-artifacts/`**
  - *Ação*: Salvar em `spec-docs/design-artifacts/<unit>_domain_model.md` e submeter para revisão.

---

## 3. Registro de Aprovação Humana (Loss Function)
- **Data da Validação**: [YYYY-MM-DD]
- **Aprovador**: [Software Engineer / Tech Lead]
- **Notas de Feedback**: [Ajustes aprovados ou solicitados]
