import path from "node:path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import { getAgentsByIds } from "./catalog.js";
import { AGENT_MANIFESTS, SKILL_CONTENTS } from "./templates/data.js";
import { mergeAgentsMd, mergeCursorRules, mergeClaudeMd } from "./rules-merger.js";
import { mergeCursorMcp, mergeVsCodeMcp } from "./mcp-merger.js";

export interface ScaffoldOptions {
  targetDir: string;
  selectedAgentIds: string[];
  enableMcp?: boolean;
  assistants?: {
    cursor?: boolean;
    claude?: boolean;
    vscode?: boolean;
    antigravity?: boolean;
  };
}

export interface ScaffoldResult {
  targetDir: string;
  installedAgents: string[];
  installedSkills: string[];
  createdFiles: string[];
  updatedFiles: string[];
  mcpConfigured: boolean;
}

export async function scaffoldAgents(options: ScaffoldOptions): Promise<ScaffoldResult> {
  const targetDir = path.resolve(options.targetDir);
  const selectedAgents = getAgentsByIds(options.selectedAgentIds);

  if (selectedAgents.length === 0) {
    throw new Error("Nenhum agente válido selecionado para instalação.");
  }

  const createdFiles: string[] = [];
  const updatedFiles: string[] = [];
  const installedSkills: string[] = [];

  // 1. Criar diretórios .agent
  const agentBaseDir = path.join(targetDir, ".agent");
  const agentsManifestDir = path.join(agentBaseDir, "agents");
  const skillsBaseDir = path.join(agentBaseDir, "skills");

  await fs.mkdir(agentsManifestDir, { recursive: true });
  await fs.mkdir(skillsBaseDir, { recursive: true });

  // 2. Injetar manifestos dos agentes
  for (const agent of selectedAgents) {
    const manifestPath = path.join(agentsManifestDir, `${agent.id}.md`);
    const content = AGENT_MANIFESTS[agent.id] || `# Agente: ${agent.name}\n\n${agent.description}\n`;
    await fs.writeFile(manifestPath, content, "utf-8");
    createdFiles.push(`.agent/agents/${agent.id}.md`);

    // 3. Injetar skills do agente
    for (const skillId of agent.skills) {
      const skillDir = path.join(skillsBaseDir, skillId);
      await fs.mkdir(skillDir, { recursive: true });
      const skillFile = path.join(skillDir, "SKILL.md");

      const skillData = SKILL_CONTENTS[skillId] || {
        description: `Skill ${skillId}`,
        content: `# Skill: ${skillId}\n`,
      };

      await fs.writeFile(skillFile, skillData.content, "utf-8");
      installedSkills.push(skillId);
      createdFiles.push(`.agent/skills/${skillId}/SKILL.md`);
    }
  }

  // 4. Configurar .agent/skills.json
  const skillsJsonPath = path.join(agentBaseDir, "skills.json");
  let skillsConfig: { entries: { path: string }[] } = { entries: [] };

  if (existsSync(skillsJsonPath)) {
    try {
      const raw = await fs.readFile(skillsJsonPath, "utf-8");
      skillsConfig = JSON.parse(raw);
    } catch {
      skillsConfig = { entries: [] };
    }
  }

  if (!skillsConfig.entries) skillsConfig.entries = [];

  const defaultEntry = ".agent/skills";
  if (!skillsConfig.entries.some((e) => e.path === defaultEntry)) {
    skillsConfig.entries.push({ path: defaultEntry });
  }

  await fs.writeFile(skillsJsonPath, JSON.stringify(skillsConfig, null, 2) + "\n", "utf-8");
  updatedFiles.push(".agent/skills.json");

  // 5. Inicializar spec-docs/ se algum agente exigir
  const needsSpecDocs = selectedAgents.some((a) => a.requiresSpecDocs);
  if (needsSpecDocs) {
    const specSubdirs = [
      "spec-docs/plans",
      "spec-docs/requirements",
      "spec-docs/specs",
      "spec-docs/story-artifacts",
      "spec-docs/design-artifacts",
    ];

    for (const sub of specSubdirs) {
      await fs.mkdir(path.join(targetDir, sub), { recursive: true });
    }

    const promptsPath = path.join(targetDir, "spec-docs", "prompts.md");
    if (!existsSync(promptsPath)) {
      const initialPrompts = `# AI-DLC Prompts & Decisions Ledger

Este arquivo registra o histórico cronológico de comandos, decisões arquiteturais e checkpoints de aprovação humana da metodologia AI-DLC praticada neste repositório.

---

## Sessão: Inicialização da Suite via CLI

- **Data**: ${new Date().toISOString().split("T")[0]}
- **Ação**: Instalação e configuração dos agentes: ${selectedAgents.map((a) => a.id).join(", ")}.
- **Status**: Context Memory pronta para receber Intents e especificações SDD.
`;
      await fs.writeFile(promptsPath, initialPrompts, "utf-8");
      createdFiles.push("spec-docs/prompts.md");
    }
  }

  // 6. Mesclar regras em AGENTS.md
  await mergeAgentsMd(targetDir, selectedAgents);
  updatedFiles.push("AGENTS.md");

  // 7. Configurações de Assistentes
  const assistants = options.assistants || { cursor: true, claude: true, vscode: true, antigravity: true };

  if (assistants.cursor) {
    const cursorFiles = await mergeCursorRules(targetDir, selectedAgents);
    updatedFiles.push(...cursorFiles.map((p) => path.relative(targetDir, p)));
  }

  if (assistants.claude) {
    await mergeClaudeMd(targetDir, selectedAgents);
    updatedFiles.push("CLAUDE.md");
  }

  // 8. Configurar servidor MCP se solicitado
  let mcpConfigured = false;
  if (options.enableMcp) {
    await mergeCursorMcp(targetDir);
    await mergeVsCodeMcp(targetDir);
    updatedFiles.push(".cursor/mcp.json", ".vscode/settings.json");
    mcpConfigured = true;
  }

  return {
    targetDir,
    installedAgents: selectedAgents.map((a) => a.id),
    installedSkills: Array.from(new Set(installedSkills)),
    createdFiles,
    updatedFiles: Array.from(new Set(updatedFiles)),
    mcpConfigured,
  };
}
