# Catálogo de Templates AI-DLC em Ordem Cronológica de Uso (Planejamento & Especificações)

Este diretório contém os templates oficiais padronizados da metodologia **AI-Driven Development Lifecycle (AI-DLC)** e **Spec-Driven Development (SDD)**.

> [!IMPORTANT]
> **Fronteira Operacional Estrita**: Estes templates cobrem **exclusivamente as fases de documentação, planejamento, arquitetura e especificação de software**. O agente **AI-DLC Specialist NÃO gera código de aplicação nem scripts de produção**. Toda implementação em código-fonte é executada por um agente de codificação posterior que consome estes artefatos.

Os arquivos estão **prefixados numericamente na exata ordem cronológica** em que devem ser criados e executados:

---

## 🧭 Tabela de Fluxo Cronológico (Planejamento & Especificação)

| # | Template | Fase / Ritual | Destino do Artefato | Descrição e Momento de Uso |
|---|---|---|---|---|
| **00** | [`00_prompts_ledger_template.md`](00_prompts_ledger_template.md) | **Setup & Governança** | `spec-docs/prompts.md` | **Início de tudo**: Criado no setup do projeto para auditar cronologicamente todos os prompts, decisões e checkpoints. |
| **01** | [`01_intent_template.md`](01_intent_template.md) | **Inception** | `spec-docs/requirements/intent.md` | **Disparo da Inception**: Captura a intenção de negócio de alto nível, conduz as perguntas de clarificação reversa da IA e define o *Pathway*. |
| **02** | [`02_code_context_elevation_template.md`](02_code_context_elevation_template.md) | **Inception (Brown-Field)** | `spec-docs/design-artifacts/code_context_elevation.md` | **Se Brown-Field (Legado)**: Elevação semântica prévia em Modelos Estáticos e Dinâmicos antes de propor novas alterações. |
| **03** | [`03_level_1_plan_template.md`](03_level_1_plan_template.md) | **Inception** | `spec-docs/plans/level_1_plan.md` | **Plano Mestre Inicial**: IA propõe o workflow de execução de alto nível com caixas de seleção `[ ]` e aguarda validação humana (*Loss Function*). |
| **04** | [`04_prfaq_template.md`](04_prfaq_template.md) | **Inception (Mob Elaboration)** | `spec-docs/requirements/prfaq.md` | **Alinhamento Executivo**: Elaboração do Press Release e FAQ (padrão Amazon Working Backwards) para clarificar o valor de negócio e benefícios. |
| **05** | [`05_user_stories_plan_template.md`](05_user_stories_plan_template.md) | **Inception (Mob Elaboration)** | `spec-docs/plans/user_stories_plan.md` | **Planejamento de Histórias**: Plano tático com checkboxes detalhando as etapas para elaboração das histórias de usuário. |
| **06** | [`06_user_stories_template.md`](06_user_stories_template.md) | **Inception (Mob Elaboration)** | `spec-docs/story-artifacts/<unit>_user_stories.md` | **Contratos Funcionais**: Redação das User Stories formais com critérios de aceite em Gherkin e vínculos de eventos. |
| **07** | [`07_nfr_definitions_template.md`](07_nfr_definitions_template.md) | **Inception (Mob Elaboration)** | `spec-docs/story-artifacts/nfr_definitions.md` | **Requisitos Não-Funcionais**: Especificação quantificada de latência P95/P99, throughput, resiliência e LGPD/GDPR. |
| **08** | [`08_risk_register_template.md`](08_risk_register_template.md) | **Inception (Mob Elaboration)** | `spec-docs/story-artifacts/risk_register.md` | **Gestão de Riscos**: Mapeamento de riscos arquiteturais e de negócio diretamente no Risk Register organizacional. |
| **09** | [`09_measurement_criteria_template.md`](09_measurement_criteria_template.md) | **Inception (Mob Elaboration)** | `spec-docs/requirements/measurement_criteria.md` | **Métricas de Valor**: Definição de critérios de medição de Business Value (substituindo story points/velocity) e telemetria de negócio. |
| **10** | [`10_units_plan_template.md`](10_units_plan_template.md) | **Inception (Mob Elaboration)** | `spec-docs/plans/units_plan.md` | **Planejamento de Unidades**: Plano com checkboxes para analisar coesão e particionar histórias em Bounded Contexts. |
| **11** | [`11_units_bolts_decomposition_template.md`](11_units_bolts_decomposition_template.md) | **Inception (Fechamento)** | `spec-docs/design-artifacts/units_decomposition.md` | **Particionamento em Units e Bolts**: Mapeamento das Units desacopladas e estimativa dos Bolts de execução rápida (horas/dias). |
| **12** | [`12_component_model_plan_template.md`](12_component_model_plan_template.md) | **Construction (Mob Programming)** | `spec-docs/plans/component_model_plan.md` | **Planejamento de Domínio**: Plano tático com checkboxes para criação dos modelos conceituais da Unit. |
| **13** | [`13_domain_design_template.md`](13_domain_design_template.md) | **Construction (Mob Programming)** | `spec-docs/design-artifacts/<unit>_domain_model.md` | **Modelagem DDD Pura**: Definição de Aggregates, Invariantes, Entities, Value Objects, Domain Events e Contratos de Repositório (sem código). |
| **14** | [`14_logical_design_adr_template.md`](14_logical_design_adr_template.md) | **Construction (Mob Programming)** | `spec-docs/design-artifacts/<unit>_logical_design.md` | **Arquitetura Lógica & ADRs**: Mapeamento para padrões em nuvem (CQRS, Event-Driven, Circuit Breaker) e registros de decisão com trade-offs. |
| **15** | [`15_deployment_plan_template.md`](15_deployment_plan_template.md) | **Construction (Design de Infra)** | `spec-docs/plans/deployment_plan.md` | **Especificação de Infraestrutura & Topologia**: Especificação de rede, dimensionamento, IAM e pré-requisitos para o agente de infraestrutura/IaC. |
| **16** | [`16_test_plan_and_validation_report_template.md`](16_test_plan_and_validation_report_template.md) | **Construction (Estratégia de Teste)**| `spec-docs/design-artifacts/test_plan_validation_report.md` | **Estratégia de Testes & Relatório de Aceite**: Especificação de cenários de teste (funcionais, segurança, carga) e matriz de conformidade. |
| **17** | [`17_deployment_units_template.md`](17_deployment_units_template.md) | **Operations & Packaging** | `spec-docs/design-artifacts/deployment_units_manifest.md` | **Especificação de Deployment Units**: Manifesto de requisitos de contêineres OCI, funções Lambda e configurações de empacotamento. |
| **18** | [`18_observability_playbook_template.md`](18_observability_playbook_template.md) | **Operations** | `spec-docs/design-artifacts/observability_playbooks.md` | **Especificação de Observabilidade & Playbooks**: Especificação de métricas monitoradas, limiares de alarme de SLA e runbooks para incidentes. |

---

## Suite de Spec-Driven Development (SDD - Microsoft)
Localizada em [`sdd/`](sdd/README.md), contendo os templates `constitution.md`, `spec.md`, `plan.md`, `tasks.md` e `converge.md`, projetados para servir de instrução e especificação para os agentes de código downstream.
