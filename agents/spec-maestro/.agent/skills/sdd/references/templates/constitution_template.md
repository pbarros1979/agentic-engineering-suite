# Engineering Constitution: [Nome do Projeto / Repositório]

**Versão**: [v1.0.0]  
**Data**: [YYYY-MM-DD]  
**Status**: [Ativa / Em Revisão]  
**Autoridade**: [Engineering Council / Tech Lead]  

---

## 1. Princípios Fundamentais de Engenharia (Invariants)
Estes princípios são mandatórios para qualquer desenvolvedor humano ou agente autônomo de IA que opere neste repositório.

1. **Spec-First & Spec-Quality**: Nenhuma linha de código funcional deve ser gerada sem antes existir uma especificação validada (`spec.md`) e um plano arquitetural (`plan.md`).
2. **Domain Isolation**: O núcleo de lógica de negócios (Domain Layer) deve permanecer 100% puro, sem acoplamento a frameworks de interface (web/CLI) ou drivers de banco de dados.
3. **Determinismo & Explicabilidade**: Código gerado por IA deve ser autoexplicativo, com funções coesas, tipagem estrita e nomes semânticos claros.
4. **Zero Vulnerabilidades Conhecidas**: Toda biblioteca de terceiros deve ser fixada em versão estável e validada contra vulnerabilidades de segurança (SAST/CVEs).

---

## 2. Guardrails Técnicos e Padrões de Arquitetura

### 2.1 Stack Tecnológica Homologada
- **Linguagem Principal**: [TypeScript / Python / Go / Java]
- **Framework Web**: [FastAPI / Express / NestJS / Spring Boot]
- **Persistência**: [PostgreSQL / DynamoDB / Redis]
- **Mensageria & Filas**: [AWS EventBridge / SQS / Kafka]

### 2.2 Padrões de Código e Qualidade
- **Tratamento de Erros**: Proibido silenciar exceções (`catch (e) {}` vazio). Utilizar padrão Result/Either ou classes de erro de domínio específicas.
- **Tipagem**: Tipagem estrita obrigatória. Proibido o uso de `any` ou tipos implícitos.
- **Cobertura de Testes**: Mínimo de 80% de cobertura de código em regras de domínio e casos de uso de aplicação.

### 2.3 Políticas de Segurança e Compliance
- **Segredos & Chaves**: Proibido *hardcoding* de senhas, tokens ou URLs de bancos. Usar injeção via variáveis de ambiente gerenciadas por Secret Managers.
- **Privacidade de Dados**: Dados sensíveis (PII) devem ser criptografados em repouso e mascarados em qualquer log do sistema.

---

## 3. Cláusula de Conformidade do Agente (Agent Guardrails)
- O agente de código deve recusar a geração de código caso a tarefa proposta viole esta Constituição.
- Qualquer exceção a estes princípios requer um Architecture Decision Record (ADR) formalmente aprovado pelo Tech Lead.
