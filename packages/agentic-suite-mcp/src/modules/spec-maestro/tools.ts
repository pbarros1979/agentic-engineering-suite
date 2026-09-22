import { z } from "zod";
import path from "node:path";
import fs from "node:fs/promises";
import { ToolDefinition } from "../../types.js";
import {
  safeEnsureDir,
  safeReadFile,
  safeWriteFile,
  safeExists,
  resolveSafePath,
} from "../../utils/safe-fs.js";

const DEFAULT_PROMPTS_MD_HEADER = `# AI-DLC Prompts & Decisions Ledger

Este arquivo registra o histórico cronológico de comandos, decisões arquiteturais e checkpoints de aprovação humana da metodologia AI-DLC praticada neste repositório.

---
`;

export const specTools: ToolDefinition[] = [
  {
    name: "spec_init_workspace",
    description: "Inicializa a estrutura de Context Memory (spec-docs/) e governança da Agentic Engineering Suite.",
    inputSchema: {
      type: "object",
      properties: {
        targetDir: {
          type: "string",
          description: "Diretório raiz do projeto (opcional, padrão: diretório atual)",
        },
      },
    },
    schema: z.object({
      targetDir: z.string().optional(),
    }),
    handler: async (args, context) => {
      const baseDir = args.targetDir || context.baseDir;
      const subdirs = [
        "spec-docs/plans",
        "spec-docs/requirements",
        "spec-docs/specs",
        "spec-docs/story-artifacts",
        "spec-docs/design-artifacts",
      ];

      const createdDirs: string[] = [];
      for (const dir of subdirs) {
        await safeEnsureDir(baseDir, dir);
        createdDirs.push(dir);
      }

      const promptsPath = "spec-docs/prompts.md";
      let promptsCreated = false;
      if (!safeExists(baseDir, promptsPath)) {
        await safeWriteFile(
          baseDir,
          promptsPath,
          DEFAULT_PROMPTS_MD_HEADER +
            `\n## Sessão: Inicialização do Workspace pelo Spec Maestro\n\n` +
            `- **Data**: ${new Date().toISOString().split("T")[0]}\n` +
            `- **Ação**: Inicialização da Context Memory (spec-docs/) via MCP Server.\n` +
            `- **Status**: Estrutura pronta para recebimento de Intents e pacotes SDD.\n`
        );
        promptsCreated = true;
      }

      return {
        content: [
          {
            type: "text",
            text: `[Spec Maestro] Workspace de governança inicializado com sucesso em "${baseDir}".\n\n` +
              `Diretórios garantidos:\n${createdDirs.map((d) => `  ✓ ${d}`).join("\n")}\n` +
              (promptsCreated ? `  ✓ spec-docs/prompts.md criado.\n` : `  ℹ spec-docs/prompts.md já existente mantido.\n`),
          },
        ],
      };
    },
  },
  {
    name: "spec_create_intent",
    description: "Cria um novo documento de Intent/Planejamento em spec-docs/plans/ com numeração sequencial e registra no ledger prompts.md.",
    inputSchema: {
      type: "object",
      properties: {
        intentName: {
          type: "string",
          description: "Nome do intent em kebab-case (ex.: user-authentication)",
        },
        title: {
          type: "string",
          description: "Título formal do intent",
        },
        businessValue: {
          type: "string",
          description: "Descrição sucinta do valor de negócio",
        },
        scope: {
          type: "string",
          description: "Definição de escopo (In-Scope e Out-of-Scope)",
        },
        targetDir: {
          type: "string",
          description: "Diretório raiz do projeto (opcional)",
        },
      },
      required: ["intentName", "title", "businessValue", "scope"],
    },
    schema: z.object({
      intentName: z.string().min(1),
      title: z.string().min(1),
      businessValue: z.string().min(1),
      scope: z.string().min(1),
      targetDir: z.string().optional(),
    }),
    handler: async (args, context) => {
      const baseDir = args.targetDir || context.baseDir;
      const plansDir = "spec-docs/plans";
      await safeEnsureDir(baseDir, plansDir);

      // Calcular próximo índice cronológico
      const safePlansPath = resolveSafePath(baseDir, plansDir);
      const entries = await fs.readdir(safePlansPath);
      let maxIndex = 0;

      for (const entry of entries) {
        const match = entry.match(/^(\d{2})_/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxIndex) maxIndex = num;
        }
      }

      const nextIndex = String(maxIndex + 1).padStart(2, "0");
      const cleanSlug = args.intentName.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
      const filename = `${nextIndex}_${cleanSlug}.md`;
      const relativeFilePath = path.join(plansDir, filename).replace(/\\/g, "/");

      const today = new Date().toISOString().split("T")[0];
      const content = `# Plano de Arquitetura & Implementação: ${args.title}

**Status**: Ready for Human Approval (Loss Function)  
**Intent**: ${args.title}  
**Business Value**: ${args.businessValue}  
**Scope**: ${args.scope}  
**Data**: ${today}  
**Autor**: Spec Maestro (\`spec-maestro\`)  

---

## 1. Visão Geral & Justificativa Estratégica
${args.businessValue}

## 2. Fronteiras de Escopo
- **In-Scope**: ${args.scope}
- **Out-of-Scope**: Implementações fora da fronteira acordada.

## 3. Decomposição em Bolts & Checkpoints
- [ ] **Bolt 1: Fundação & Contratos de Domínio**
- [ ] **Bolt 2: Implementação & Testes**
- [ ] **Bolt 3: Validação de Convergência & Documentação**
`;

      await safeWriteFile(baseDir, relativeFilePath, content);

      // Registrar no livro-razão prompts.md se existir
      const promptsPath = "spec-docs/prompts.md";
      if (safeExists(baseDir, promptsPath)) {
        const existingPrompts = await safeReadFile(baseDir, promptsPath);
        const logEntry = `\n---\n\n## Sessão: Criação do Intent "${args.title}"\n\n` +
          `- **Data**: ${today}\n` +
          `- **Ação**: Criação do arquivo de planejamento \`${relativeFilePath}\`.\n` +
          `- **Valor de Negócio**: ${args.businessValue}\n` +
          `- **Status**: Aguardando aprovação humana da Loss Function.\n`;
        await safeWriteFile(baseDir, promptsPath, existingPrompts + logEntry);
      }

      return {
        content: [
          {
            type: "text",
            text: `[Spec Maestro] Novo Intent criado com sucesso em "${relativeFilePath}".\n` +
              `Status: Ready for Human Approval. Registrado em spec-docs/prompts.md.`,
          },
        ],
      };
    },
  },
  {
    name: "spec_generate_sdd_package",
    description: "Gera o pacote de 5 contratos SDD (constitution, spec, plan, tasks, converge) para uma feature em spec-docs/specs/<featureName>/.",
    inputSchema: {
      type: "object",
      properties: {
        featureName: {
          type: "string",
          description: "Nome da feature em kebab-case (ex.: user-service)",
        },
        description: {
          type: "string",
          description: "Descrição e objetivos da feature",
        },
        targetDir: {
          type: "string",
          description: "Diretório raiz do projeto (opcional)",
        },
      },
      required: ["featureName", "description"],
    },
    schema: z.object({
      featureName: z.string().min(1),
      description: z.string().min(1),
      targetDir: z.string().optional(),
    }),
    handler: async (args, context) => {
      const baseDir = args.targetDir || context.baseDir;
      const cleanSlug = args.featureName.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
      const specDir = `spec-docs/specs/${cleanSlug}`;
      await safeEnsureDir(baseDir, specDir);

      const today = new Date().toISOString().split("T")[0];

      const constitutionContent = `# Constitution: ${args.featureName}

**Data**: ${today}  
**Autor**: Spec Maestro (\`spec-maestro\`)  

## 1. Princípios Inegociáveis & Guardrails
- **Zero-Code de Produção**: O Spec Maestro define contratos, arquitetura e limites. O código executável é responsabilidade dos engenheiros de implementação.
- **SSOT em Markdown**: Este diretório representa a verdade do contrato.
- **Validação de Conformidade**: Nenhum bolt é dado como concluído sem teste automatizado correspondente.

## 2. Fronteiras de Domínio & Regras Arquiteturais
- **Descrição da Feature**: ${args.description}
`;

      const specContent = `# Specification: ${args.featureName}

**Status**: Em Especificação  
**Data**: ${today}  

## 1. Visão Geral & Problema de Negócio
${args.description}

## 2. Histórias de Usuário & Critérios de Aceite (BDD)
### US01: Operação Principal
- **Dado que**: O sistema está em estado operacional válido
- **Quando**: Uma requisição da feature ${cleanSlug} é submetida
- **Então**: O processamento deve ocorrer com sucesso e retorno padronizado

## 3. Requisitos Não-Funcionais
- Resiliência e tratamento seguro de erros.
- Isolamento de canais e proteção de integridade.
`;

      const planContent = `# Tactical Implementation Plan: ${args.featureName}

**Feature**: ${args.featureName}  
**Data**: ${today}  

## 1. Decomposição em Bolts
- [ ] **Bolt 1: Modelagem de Dados & Contratos**
- [ ] **Bolt 2: Implementação de Lógica Central**
- [ ] **Bolt 3: Testes de Integração & Cobertura**
- [ ] **Bolt 4: Documentação e Auditoria de Convergência**

## 2. Checkpoints de Loss Function Humana
- Checkpoint 1: Revisão do contrato e invariantes
- Checkpoint 2: Execução de suites de teste automatizadas
`;

      const tasksContent = `# Granular Tasks: ${args.featureName}

## Bolt 1: Modelagem & Contratos
- [ ] T1.1: Definir schemas de entrada e saída
- [ ] T1.2: Validar fronteiras de domínio

## Bolt 2: Implementação Central
- [ ] T2.1: Implementar handlers de negócio
- [ ] T2.2: Tratar cenários defensivos de erro

## Bolt 3: Testes
- [ ] T3.1: Escrever testes unitários
- [ ] T3.2: Testar casos de borda e limites de sandbox

## Bolt 4: Convergência
- [ ] T4.1: Validar evidências na matriz de convergência
`;

      const convergeContent = `# Convergence & Acceptance Matrix: ${args.featureName}

**Feature**: ${args.featureName}  
**Status**: IN_PROGRESS  

| Requisito / Critério | Status | Evidência de Validação |
| -------------------- | ------ | ---------------------- |
| Schemas e Tipagem    | [ ] Pendente | Schemas validados com testes unitários |
| Testes Automatizados | [ ] Pendente | Cobertura de testes executada com sucesso |
| Auditoria de Regras  | [ ] Pendente | spec_audit_convergence sem apontamentos |
`;

      const files = [
        { file: `${specDir}/constitution.md`, content: constitutionContent },
        { file: `${specDir}/spec.md`, content: specContent },
        { file: `${specDir}/plan.md`, content: planContent },
        { file: `${specDir}/tasks.md`, content: tasksContent },
        { file: `${specDir}/converge.md`, content: convergeContent },
      ];

      for (const item of files) {
        await safeWriteFile(baseDir, item.file, item.content);
      }

      return {
        content: [
          {
            type: "text",
            text: `[Spec Maestro] Pacote contratual SDD gerado com sucesso para "${cleanSlug}":\n\n` +
              files.map((f) => `  ✓ ${f.file}`).join("\n") +
              `\n\nPróximo passo: Elaborar histórias de usuário e acionar os agentes executores para implementação.`,
          },
        ],
      };
    },
  },
  {
    name: "spec_audit_convergence",
    description: "Audita a integridade de spec-docs/, verifica contratos SDD e calcula o progresso de tarefas concluídas.",
    inputSchema: {
      type: "object",
      properties: {
        featureName: {
          type: "string",
          description: "Nome de uma feature específica sob spec-docs/specs/ para auditar (opcional)",
        },
        targetDir: {
          type: "string",
          description: "Diretório raiz do projeto (opcional)",
        },
      },
    },
    schema: z.object({
      featureName: z.string().optional(),
      targetDir: z.string().optional(),
    }),
    handler: async (args, context) => {
      const baseDir = args.targetDir || context.baseDir;

      if (!safeExists(baseDir, "spec-docs")) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `[Spec Maestro] Diretório "spec-docs/" não encontrado em "${baseDir}". Execute "spec_init_workspace" primeiro.`,
            },
          ],
        };
      }

      let totalCheckboxes = 0;
      let completedCheckboxes = 0;
      const issues: string[] = [];
      const auditedFeatures: string[] = [];

      const checkFileCheckboxes = async (relPath: string) => {
        if (!safeExists(baseDir, relPath)) return;
        const text = await safeReadFile(baseDir, relPath);
        const done = (text.match(/- \[[xX]\]/g) || []).length;
        const pending = (text.match(/- \[ \]/g) || []).length;
        completedCheckboxes += done;
        totalCheckboxes += done + pending;
      };

      const specsBase = "spec-docs/specs";
      if (safeExists(baseDir, specsBase)) {
        const safeSpecsDir = resolveSafePath(baseDir, specsBase);
        const entries = await fs.readdir(safeSpecsDir, { withFileTypes: true });
        const featureDirs = entries
          .filter((e) => e.isDirectory())
          .map((e) => e.name)
          .filter((name) => !args.featureName || name === args.featureName);

        for (const feature of featureDirs) {
          auditedFeatures.push(feature);
          const expected = ["constitution.md", "spec.md", "plan.md", "tasks.md", "converge.md"];
          for (const exp of expected) {
            const rel = `${specsBase}/${feature}/${exp}`;
            if (!safeExists(baseDir, rel)) {
              issues.push(`Feature "${feature}": Arquivo contratual ausente "${exp}".`);
            } else {
              await checkFileCheckboxes(rel);
            }
          }
        }
      }

      // Auditar também plans
      const plansBase = "spec-docs/plans";
      if (safeExists(baseDir, plansBase)) {
        const safePlansDir = resolveSafePath(baseDir, plansBase);
        const planFiles = await fs.readdir(safePlansDir);
        for (const file of planFiles) {
          if (file.endsWith(".md")) {
            await checkFileCheckboxes(`${plansBase}/${file}`);
          }
        }
      }

      const percent = totalCheckboxes > 0
        ? Math.round((completedCheckboxes / totalCheckboxes) * 100)
        : 100;

      const status = issues.length > 0
        ? "ATENÇÃO (Pendências de Contrato)"
        : percent === 100
        ? "CONVERGIDO (100% Concluído)"
        : "EM PROGRESSO";

      const report = [
        `[Spec Maestro] Relatório de Auditoria de Convergência`,
        `Status Geral: ${status}`,
        `Tarefas Concluídas: ${completedCheckboxes}/${totalCheckboxes} (${percent}%)`,
        auditedFeatures.length > 0
          ? `Features Auditadas em spec-docs/specs/: ${auditedFeatures.join(", ")}`
          : `Nenhuma feature específica cadastrada em spec-docs/specs/.`,
        issues.length > 0
          ? `\nApontamentos Identificados:\n${issues.map((i) => `  ⚠ ${i}`).join("\n")}`
          : `\nNenhum problema de integridade de arquivo identificado.`,
      ].join("\n");

      return {
        content: [{ type: "text", text: report }],
      };
    },
  },
];
