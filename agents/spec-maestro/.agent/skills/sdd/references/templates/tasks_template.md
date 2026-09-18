# Actionable Implementation Tasks: [Nome da Feature / Módulo]

**Referência**: SPEC `spec-docs/specs/<unit>/spec.md` & PLAN `spec-docs/specs/<unit>/plan.md`  
**Status**: [Not Started / In Progress / Completed]  
**Bolt Associado**: [Bolt 1.1 / Bolt 1.2]  

---

## 1. Diretrizes para o Agente de Execução (AI Coding Rules)
> [!IMPORTANT]
> 1. Execute **uma tarefa atômica por vez** na sequência exata abaixo.
> 2. Marque o checkbox `[x]` imediatamente após a conclusão e validação do teste da tarefa.
> 3. Não invente comportamentos fora do especificado no `spec.md` ou `plan.md`.
> 4. Obedeça rigorosamente aos padrões da `constitution.md`.

---

## 2. Lista Sequencial de Tarefas Atômicas

### Bloco A: Domínio Puro & Value Objects
- [ ] **TASK-01**: Implementar o Value Object `ResourceStatus` com validação imutável de estados.
  - *Arquivo*: `src/domain/values/ResourceStatus.ts`
  - *Critério de Conclusão*: Teste unitário cobrindo estados válidos e exceção para valor inválido.
- [ ] **TASK-02**: Implementar o evento de domínio `ResourceCreatedEvent`.
  - *Arquivo*: `src/domain/events/ResourceCreatedEvent.ts`
  - *Critério de Conclusão*: Serialização JSON estrita com timestamp UTC e UUID.
- [ ] **TASK-03**: Implementar a Entidade Raiz `ResourceAggregate` com método de fábrica `create()`.
  - *Arquivo*: `src/domain/entities/Resource.ts`
  - *Critério de Conclusão*: Garantir que invariantes de negócio disparem exceção antes de alterar estado.

### Bloco B: Interfaces e Casos de Uso (Application Layer)
- [ ] **TASK-04**: Definir a interface de repositório `IResourceRepository`.
  - *Arquivo*: `src/domain/ports/IResourceRepository.ts`
  - *Critério de Conclusão*: Métodos `save(entity)` e `findById(id)` tipados com Promises.
- [ ] **TASK-05**: Implementar DTOs de Request e Response com validação de schema.
  - *Arquivo*: `src/application/dtos/CreateResourceDto.ts`
  - *Critério de Conclusão*: Schema Zod/Pydantic validando inputs e formatos obrigatórios.
- [ ] **TASK-06**: Implementar o caso de uso `CreateResourceUseCase`.
  - *Arquivo*: `src/application/use-cases/CreateResourceUseCase.ts`
  - *Critério de Conclusão*: Teste unitário com mock de repositório validando fluxo de sucesso e persistência.

### Bloco C: Adaptadores de Infraestrutura & Endpoints (Infra Layer)
- [ ] **TASK-07**: Implementar o repositório concreto `PostgresResourceRepository`.
  - *Arquivo*: `src/infrastructure/repositories/PostgresResourceRepository.ts`
  - *Critério de Conclusão*: Teste de integração gravando e recuperando o registro do banco.
- [ ] **TASK-08**: Implementar o endpoint REST no controller web.
  - *Arquivo*: `src/infrastructure/controllers/ResourceController.ts`
  - *Critério de Conclusão*: Rota mapeada retornando HTTP 201 com o payload especificado.

### Bloco D: Validação Fim a Fim e Convergência
- [ ] **TASK-09**: Executar suíte de testes ponta a ponta (E2E) simulando requisição HTTP real.
- [ ] **TASK-10**: Executar auditoria de convergência com `converge.md` para certificar ausência de spec drift.
