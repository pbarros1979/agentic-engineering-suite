# Risk Register: [Nome da Unit / Sistema]

**Unit / Projeto**: [Nome da Unit]  
**Status**: [Ativo / Mitigado / Sob Monitoramento]  
**Última Atualização**: [YYYY-MM-DD]  
**Responsável**: [Tech Lead / Security Champion / PO]  

---

## 1. Visão Geral de Riscos no AI-DLC
No framework AI-DLC, o Registro de Riscos atua como um contrato simbiótico entre humanos e IA, garantindo que os planos, modelos de domínio e código gerados por IA estejam em estrita conformidade com os frameworks de risco organizacional.

---

## 2. Matriz de Classificação de Risco (Probabilidade x Impacto)

| Severidade | Descrição | Ação Exigida |
|---|---|---|
| **Crítica (P1)** | Risco de paralisação de negócio, vazamento de PII ou quebra de SLA contratual. | Mitigação imediata obrigatória antes de qualquer avanço de Bolt. |
| **Alta (P2)** | Risco arquitetural que causa degradação acentuada ou retrabalho estrutural severo. | Mitigação documentada e aprovada pelo Arquiteto. |
| **Média (P3)** | Risco com impacto operacional contornável por redundância ou timeout. | Monitoramento ativo e automação de alertas. |
| **Baixa (P4)** | Ineficiência menor sem impacto direto no usuário final. | Backlog de melhoria contínua. |

---

## 3. Tabela de Riscos Identificados e Mitigações

| ID do Risco | Categoria | Descrição Detalhada | Probabilidade | Impacto | Severidade | Estratégia de Mitigação | Status |
|---|---|---|---|---|---|---|---|
| **RSK-01** | Arquitetura | Acoplamento excessivo entre Units gerando indisponibilidade em cascata. | Média | Alta | Alta | Adotar padrão Event-Driven desacoplado com EventBridge / Filas e circuit breakers. | Planejado |
| **RSK-02** | Segurança / Compliance | Exposição acidental de chaves de API ou dados sensíveis em logs gerados pela IA. | Baixa | Crítica | Crítica | Mascaramento automático de logs e uso de AWS Secrets Manager / KMS. | Validado |
| **RSK-03** | IA / Quick-Cement | Código gerado pela IA excessivamente rígido para futuras alterações arquiteturais. | Média | Alta | Alta | Validação humana contínua em cada etapa como Loss Function; Domain Design desacoplado. | Em Execução |
| **RSK-04** | Performance | Sobrecarga do banco de dados em horários de pico durante consultas analíticas. | Alta | Média | Alta | Leitura com cache distribuído (Redis/DAX) e replicação de leitura assíncrona. | Planejado |

---

## 4. Checkpoint de Revisão do Registro de Riscos
- [ ] O Product Owner avaliou os riscos de negócio e reputacionais.
- [ ] O Arquiteto validou as medidas mitigatórias técnicas no Logical Design.
- [ ] Os testes de segurança e caos incorporaram os cenários de risco acima.
