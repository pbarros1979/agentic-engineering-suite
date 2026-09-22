import { PromptDefinition } from "../../types.js";

export const specPrompts: PromptDefinition[] = [
  {
    name: "spec/mob-elaboration",
    description: "Guia interativo para conduzir sessão de Inception, Mob Elaboration e DDD",
    arguments: [
      {
        name: "intent",
        description: "Descrição do intent de negócio ou técnico a ser elaborado",
        required: true,
      },
      {
        name: "domainContext",
        description: "Contexto do domínio ou sistema existente (Green-Field ou Brown-Field)",
        required: false,
      },
    ],
    handler: async (args) => {
      const intent = args.intent || "Não especificado";
      const domainContext = args.domainContext || "Repositório atual";

      return {
        description: "Roteiro de Mob Elaboration pelo Spec Maestro",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Atue como **Spec Maestro** (SDLC Planning & Spec Architect) e conduza uma sessão de **Mob Elaboration** para o seguinte Intent:\n\n` +
                `- **Intent**: ${intent}\n` +
                `- **Contexto do Domínio**: ${domainContext}\n\n` +
                `### Diretrizes Obrigatórias:\n` +
                `1. Mantenha a fronteira de **Zero-Code de Produção**: não escreva implementações de código-fonte.\n` +
                `2. Mapeie a Linguagem Ubíqua e os Bounded Contexts envolvidos.\n` +
                `3. Estabeleça as fronteiras In-Scope e Out-of-Scope.\n` +
                `4. Decomponha a entrega em Units conceituais e Bolts táticos com checkpoints de Loss Function Humana.\n` +
                `5. Formule as perguntas clarificadoras necessárias antes de consolidar o pacote SDD.`,
            },
          },
        ],
      };
    },
  },
  {
    name: "spec/sdd-package",
    description: "Guia para geração de pacote contratual SDD (Constitution, Spec, Plan, Tasks, Converge)",
    arguments: [
      {
        name: "featureName",
        description: "Nome da feature (kebab-case)",
        required: true,
      },
      {
        name: "requirements",
        description: "Requisitos funcionais e de negócio",
        required: true,
      },
    ],
    handler: async (args) => {
      const feature = args.featureName || "feature-example";
      const requirements = args.requirements || "Requisitos pendentes";

      return {
        description: "Geração de pacote contratual SDD",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Atue como **Spec Maestro** e formule a suite completa de 5 artefatos SDD para a feature "${feature}":\n\n` +
                `**Requisitos Informados**:\n${requirements}\n\n` +
                `Gere a especificação nos 5 arquivos contratuais em \`spec-docs/specs/${feature}/\`:\n` +
                `1. \`constitution.md\`: Invariantes, governança e limites do domínio.\n` +
                `2. \`spec.md\`: Casos de uso, critérios de aceite em BDD e requisitos não-funcionais.\n` +
                `3. \`plan.md\`: Fatiamento tático em Bolts com checkboxes \`[ ]\`.\n` +
                `4. \`tasks.md\`: Lista acionável e atômica de tarefas técnicas para os executores.\n` +
                `5. \`converge.md\`: Matriz de convergência e evidências exigidas para aprovação.\n\n` +
                `Lembre-se: Você é o arquiteto de especificação, não gere código de produção!`,
            },
          },
        ],
      };
    },
  },
  {
    name: "spec/audit-convergence",
    description: "Guia de auditoria de convergência e loss function humana",
    arguments: [
      {
        name: "featureName",
        description: "Nome da feature para auditoria",
        required: false,
      },
    ],
    handler: async (args) => {
      const feature = args.featureName || "Geral";

      return {
        description: "Auditoria de convergência de especificações",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Atue como **Spec Maestro** e realize uma **Auditoria de Convergência** para "${feature}".\n\n` +
                `Verifique:\n` +
                `1. Todos os checkboxes em \`plan.md\` e \`tasks.md\` foram devidamente concluídos ou justificados?\n` +
                `2. Houve desvio de escopo em relação à \`constitution.md\`?\n` +
                `3. As evidências em \`converge.md\` atendem à Loss Function humana?\n` +
                `4. O histórico em \`spec-docs/prompts.md\` foi atualizado?\n` +
                `Emita o veredito final: CONVERGIDO ou NECESSITA REFINAMENTO.`,
            },
          },
        ],
      };
    },
  },
];
