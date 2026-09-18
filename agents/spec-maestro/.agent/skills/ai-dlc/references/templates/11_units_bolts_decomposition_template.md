# Decomposição de Intent em Units e Bolts

**Intent**: [Descrição do Intent de Alto Nível]  
**Data da Mob Elaboration**: [YYYY-MM-DD]  
**Facilitador**: [AI-DLC Specialist]  
**Participantes**: [Product Owner, Tech Lead, Arquiteto, QA]  

---

## 1. Mapeamento Estratégico de Units (Bounded Contexts)

Uma **Unit** no AI-DLC representa um bloco funcional independente com alta coesão e baixo acoplamento (equivalente a Subdomínios no DDD ou Epics com deploy independente).

| Unit ID | Nome da Unit | Bounded Context / Responsabilidade | Dependências Externas | Modelo de Deploy Proposto |
|---|---|---|---|---|
| **UNIT-01** | [Nome da Unit 1] | [Responsabilidade única do domínio] | Nenhuma | Microserviço / Lambda Serverless |
| **UNIT-02** | [Nome da Unit 2] | [Responsabilidade única do domínio] | UNIT-01 (Event-driven assíncrono) | Worker Assíncrono / Container |

---

## 2. Detalhamento de Units e Planejamento de Bolts

### Unit: [UNIT-01: Nome da Unit]
- **Objetivo de Negócio**: [O que entrega]
- **Histórias de Usuário Vinculadas**: `US-001`, `US-002`, `US-003`
- **Fatores de Desacoplamento**: [Como se comunica: APIs REST, Filas SQS, EventBridge]

#### Planejamento de Bolts (Ciclos rápidos em horas/dias)
Um **Bolt** é a menor iteração de construção e validação (medido em horas ou dias, substituindo a Sprint de semanas).

| Bolt ID | Escopo do Bolt | Duração Estimada | Entregável / Verificação | Dependências |
|---|---|---|---|---|
| **Bolt 1.1** | Domain Model DDD & Entidades Core | 4 - 6 horas | Especificação validada + Testes de domínio | Nenhuma |
| **Bolt 1.2** | Logical Design & Implementação API REST | 8 - 12 horas | Código executável + Testes de integração | Bolt 1.1 |
| **Bolt 1.3** | IaC, Testes de Performance & Deploy Staging | 4 - 8 horas | Deployment Unit testada e pronta | Bolt 1.2 |

---

## 3. Matriz de Rastreabilidade (Traceability Matrix)

| Intent Goal | Unit | User Stories | Bolt | Métrica de Valor |
|---|---|---|---|---|
| [Meta 1] | UNIT-01 | US-001, US-002 | Bolt 1.1, 1.2 | [KPI 1] |
| [Meta 2] | UNIT-02 | US-003 | Bolt 2.1 | [KPI 2] |

---

## 4. Checkpoint de Aprovação (Loss Function)
- [ ] Product Owner validou o particionamento das Units e aderência às regras de negócio.
- [ ] Arquiteto validou o desacoplamento e o modelo de comunicação entre Units.
- [ ] Time de Engenharia validou o escopo dos Bolts e viabilidade técnica.
