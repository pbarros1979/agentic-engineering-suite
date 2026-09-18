---
name: ai-dlc
description: >-
  Metodologia AI-Driven Development Lifecycle (AI-DLC) da AWS (Raja SP) para conduzir o ciclo de desenvolvimento de software nativo de IA.
  Use esta skill para orientar a elaboração de requisitos (Mob Elaboration), decomposição de Intent em Units e Bolts,
  modelagem conceitual Domain-Driven Design (DDD), arquitetura lógica com ADRs, planos com aprovação humana iterativa (Loss Function) e Context Memory em spec-docs/.
---

# AI-Driven Development Lifecycle (AI-DLC) - AWS Framework

Guia e procedimentos operacionais para condução do SDLC nativo de IA, baseado na definição metodológica de Raja SP (Amazon Web Services).

O AI-DLC estabelece uma mudança de paradigma: em vez de adaptar métodos ágeis legados (concebidos para iterações de semanas/meses e processos manuais), o AI-DLC adota princípios nativos de IA onde os ciclos de iteração são medidos em **horas ou dias** ("Bolts"), e a direção da conversa é **invertida** (a IA propõe e direciona, o humano valida e toma decisões estratégicas).

> [!IMPORTANT]
> **Fronteira Operacional Estrita**: Esta skill e o agente associado atuam **exclusivamente nas fases de documentação, planejamento, arquitetura e detalhamento de especificações técnicas**. O agente **NUNCA implementa código de aplicação, scripts executáveis ou automações de produção**. A implementação do código é realizada por agentes de desenvolvimento posteriores (*Coding Agents*) que consomem as especificações aqui geradas.

---

## 1. Princípios Fundamentais

1. **Reimagine Rather Than Retrofit**: Não force o fluxo do Scrum/Kanban com IA adaptada. Substitua rituais lentos por iteração contínua. Substitua Story Points e Velocity por Entrega Contínua de Valor de Negócio em **Bolts** de horas/dias.
2. **Reverse the Conversation Direction**: A IA inicia o diálogo, formula perguntas de clarificação, decompõe tarefas em planos com checkboxes e sugere soluções arquiteturais. O humano atua como aprovador e tomador de decisões em pontos críticos (como um motorista acompanhando o Waze/Google Maps).
3. **Integration of Design Techniques into the Core**: Domain-Driven Design (DDD) é o núcleo do processo. A IA elabora a modelagem estratégica (Bounded Contexts) e tática pura (Aggregates, Entities, Value Objects, Domain Events, Repositórios) agnóstica de frameworks antes de qualquer decisão de código.
4. **Align with AI Capability**: O humano mantém a supervisão e responsabilidade final ("loss function"), mitigando riscos e impedindo a formação de código "quick-cement".
5. **Cater to Building Complex Systems**: Projetado para sistemas corporativos com alta complexidade arquitetural, gestão de trade-offs, escalabilidade, segurança e NFRs.
6. **Retain What Enhances Human Symbiosis**: Manutenção de contratos claros como User Stories com critérios de aceite e Registro de Riscos (Risk Register).
7. **Facilitate Transition Through Familiarity**: Conceitos familiares modernizados (ex.: Sprints de semanas tornam-se **Bolts** de horas/dias).
8. **Streamline Responsibilities for Efficiency**: Convergência de papéis em desenvolvedores full-spectrum apoiados por IA + Product Owners com foco em valor e compliance.
9. **Minimise Stages, Maximise Flow**: Validações humanas estratégicas que descartam antecipadamente caminhos incorretos antes que desperdícios se propaguem downstream.
10. **No Hard-Wired, Opinionated SDLC Workflows**: A IA gera um **Level 1 Plan** específico para o cenário (Green-field, Brown-field, refatoração, correção de defeito) e desdobra interativamente em sub-tarefas de Nível 2.

---

## 2. Artefatos Centrais

* **Intent**: Propósito de negócio ou técnico de alto nível (ex.: *"Desenvolver um motor de recomendação para cross-selling de produtos"*).
* **Unit**: Elemento de trabalho coeso, autocontido e desacoplado, derivado do Intent (análogo a um Subdomínio no DDD ou Epic no Scrum).
* **Bolt**: Menor ciclo de iteração rápida do AI-DLC (medido em horas ou poucos dias). Executa uma Unit ou conjunto de histórias de uma Unit.
* **Domain Design**: Modelagem conceitual pura, agnóstica de infraestrutura (Aggregates, Entities, Value Objects, Domain Events, Repositórios e Fábricas).
* **Logical Design & ADRs**: Extensão do Domain Design para atender NFRs com padrões de arquitetura em nuvem (CQRS, Circuit Breaker, Serverless, Event-Driven) e Architecture Decision Records (ADRs).
* **Deployment Units Specification**: Especificação dos requisitos de empacotamento operacional e topologia de deploy.
* **Context Memory**: Repositório centralizado e interligado de todos os artefatos em `spec-docs/`.

---

## 3. Fases e Rituais

### Fase 1: Inception (Ritual: *Mob Elaboration*)
- **Passo 1 (Clarificação Reversa)**: A IA faz perguntas para eliminar ambiguidades sobre público, valor e restrições.
- **Passo 2 (PRFAQ)**: IA gera o PRFAQ resumindo valor de negócio, escopo e benefícios.
- **Passo 3 (Elaboração de User Stories, NFRs e Riscos)**: IA detalha histórias contratuais, NFRs quantificados e mapeamento de riscos.
- **Passo 4 (Decomposição em Units e Bolts)**: IA propõe agrupamento de histórias em Units desacopladas e planeja os Bolts de execução.
- **Passo 5 (Aprovação Humana - Loss Function)**: Revisão e aprovação explícita antes de qualquer avanço.

### Fase 2: Construction (Ritual: *Mob Architecture & Design*)
- **Cenário Brown-field**: Elevação semântica prévia do código legado em modelos estáticos e dinâmicos.
- **Cenário Green-field**:
  1. A IA elabora o **Domain Design** (DDD). O desenvolvedor valida e ajusta.
  2. A IA elabora o **Logical Design** e recomenda serviços de nuvem e padrões de arquitetura (ADRs).
  3. A IA detalha as especificações de topologia e estratégias de teste para handoff ao agente de codificação.

### Fase 3: Operations Specification
- Especificação de manifestos de Deployment Units.
- Observabilidade contínua (análise de telemetria e especificação de playbooks de resposta a incidentes).

---

## 4. Estrutura de Pastas Obrigatória (`spec-docs`)

```text
spec-docs/
├── plans/               # Level 1 Plans, planos de histórias, planos de unidades com checkboxes
│   ├── level_1_plan.md
│   ├── user_stories_plan.md
│   └── units_plan.md
├── requirements/        # PRFAQs, descrições de negócio e NFRs
│   ├── intent.md
│   └── prfaq.md
├── story-artifacts/     # Histórias de usuário, NFRs e Risk Register
│   ├── <unit>_user_stories.md
│   ├── nfr_definitions.md
│   └── risk_register.md
├── design-artifacts/    # Domain models DDD, Logical designs, ADRs, estratégias de teste
│   ├── <unit>_domain_model.md
│   ├── <unit>_logical_design.md
│   └── adr-<num>-<title>.md
└── prompts.md           # Histórico ordenado de todos os prompts e decisões da sessão
```

---

## 5. Protocolo de Interação do Especialista AI-DLC

1. **Sempre Crie um Plano Inicial com Checkboxes**: Antes de gerar qualquer especificação, crie um arquivo `.md` em `spec-docs/plans/` com as etapas detalhadas e caixas de seleção `[ ]`.
2. **Sinalize Dúvidas para o Usuário**: Se houver qualquer ambiguidade, inclua uma nota explícita no plano solicitando confirmação.
3. **Aguarde Aprovação Humana**: Não tome decisões críticas isoladamente. Solicite a validação do plano pelo PO/Arquiteto.
4. **Execute Passo a Passo com Checkboxes**: Após aprovado, execute um passo de cada vez, marcando `[x]` no arquivo de plano correspondente.
5. **Registre no Histórico**: Mantenha o arquivo `spec-docs/prompts.md` sincronizado com cada comando e decisão chave.

---

## 6. Documentação Complementar e Templates

Consulte os arquivos na pasta `references/`:
- [references/methodology_guide.md](references/methodology_guide.md): Guia aprofundado dos 10 princípios e rituais do AI-DLC.
- [references/prompts_handbook.md](references/prompts_handbook.md): Caderno com os prompts padrão do Appendix A do paper oficial da AWS.
- [references/templates/README.md](references/templates/README.md): **Catálogo Completo dos 19 Templates Oficiais de Planejamento e Especificação AI-DLC (00 a 18)**.
- **Para pacotes de especificação detalhada em nível de implementação**: Utilize a skill complementar [sdd](file:///.agent/skills/sdd/SKILL.md) (Spec-Driven Development da Microsoft).
