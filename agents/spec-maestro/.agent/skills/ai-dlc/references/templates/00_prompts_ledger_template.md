# Prompts & Decisions Ledger Template: [Nome do Projeto]

Este arquivo é o modelo de registro ordenado de todos os prompts, respostas de planejamento, decisões arquiteturais e checkpoints de aprovação humana ao longo do ciclo de vida AI-DLC.

---

## Estrutura Padronizada de Registro

### [SESSÃO #X] - [Fase: Inception / Construction / Operations] - [YYYY-MM-DD HH:MM]

#### 1. Contexto & Prompt Enviado
```text
[Transcrição literal do prompt ou intenção de trabalho enviada para a IA]
```

#### 2. Proposta de Plano Gerada pela IA
- **Arquivo de Plano Criado/Atualizado**: `spec-docs/plans/<nome_do_plano>.md`
- **Resumo das Etapas Propostas**:
  1. [Etapa 1...]
  2. [Etapa 2...]
- **Notas de Clarificação / Pontos de Atenção**: [Dúvidas levantadas pela IA]

#### 3. Decisão & Aprovação Humana (Loss Function)
- **Status da Revisão**: [Aprovado / Modificado / Rejeitado]
- **Responsável**: [Nome do PO / Tech Lead / Arquiteto]
- **Instruções de Ajuste do Usuário**:
  > "[Feedback ou direcionamento fornecido pelo usuário]"

#### 4. Execução e Artefatos Produzidos
| Artefato Gerado / Modificado | Caminho no Repositório | Status da Validação |
|---|---|---|
| [ex.: PRFAQ] | `spec-docs/requirements/prfaq.md` | Validado |
| [ex.: User Stories] | `spec-docs/story-artifacts/<unit>_user_stories.md` | Validado |
| [ex.: Domain Model] | `spec-docs/design-artifacts/<unit>_domain_model.md` | Validado |

#### 5. Próximo Passo Acordado
- [Ação imediata a ser disparada no ciclo de vida]
