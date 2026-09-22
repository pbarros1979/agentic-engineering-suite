import path from "node:path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import { AgentDefinition } from "./catalog.js";

const CORE_AGENTS_MD = `# Diretrizes do Ecossistema: Agentic Engineering Suite

Este repositório é gerenciado através da metodologia de **Engenharia de Software Nativa de IA (AI-Native Software Engineering)** da Agentic Engineering Suite.

## 1. Princípios Gerais do Ecossistema
- **Camada Cognitiva vs. Camada Determinística**: O Markdown em \`.agent/\` e \`spec-docs/\` representa a Única Fonte da Verdade (SSOT). Ferramentas determinísticas executáveis são providas via MCP Servers e scripts tipados.
- **Divisão Estrita de Papéis**: Cada agente especializado possui fronteiras operacionais claras. Nenhum agente deve ultrapassar sua área de responsabilidade sem handoff formal.
- **Isolamento e Segurança**: Nenhuma alteração não autorizada fora dos boundaries definidos no repositório.
`;

export async function mergeAgentsMd(
  targetDir: string,
  activeAgents: AgentDefinition[]
): Promise<string> {
  const agentsPath = path.join(targetDir, "AGENTS.md");
  let content = "";

  if (existsSync(agentsPath)) {
    content = await fs.readFile(agentsPath, "utf-8");
  }

  // 1. Gerenciar bloco CORE
  const coreMarkerStart = "<!-- BEGIN AGENTIC-SUITE: CORE -->";
  const coreMarkerEnd = "<!-- END AGENTIC-SUITE: CORE -->";
  const coreBlock = `${coreMarkerStart}\n${CORE_AGENTS_MD}\n${coreMarkerEnd}`;

  if (content.includes(coreMarkerStart) && content.includes(coreMarkerEnd)) {
    const regex = new RegExp(`${coreMarkerStart}[\\s\\S]*?${coreMarkerEnd}`, "g");
    content = content.replace(regex, coreBlock);
  } else if (content.trim().length === 0) {
    content = coreBlock;
  } else {
    content = `${content.trim()}\n\n${coreBlock}`;
  }

  // 2. Gerenciar blocos de cada agente
  for (const agent of activeAgents) {
    const startTag = `<!-- BEGIN AGENTIC-SUITE: ${agent.id.toUpperCase()} -->`;
    const endTag = `<!-- END AGENTIC-SUITE: ${agent.id.toUpperCase()} -->`;
    const agentBlock = `${startTag}\n${agent.rulesSnippet}\n${endTag}`;

    if (content.includes(startTag) && content.includes(endTag)) {
      const regex = new RegExp(`${startTag}[\\s\\S]*?${endTag}`, "g");
      content = content.replace(regex, agentBlock);
    } else {
      content = `${content.trim()}\n\n${agentBlock}`;
    }
  }

  await fs.writeFile(agentsPath, `${content.trim()}\n`, "utf-8");
  return agentsPath;
}

export async function mergeCursorRules(
  targetDir: string,
  activeAgents: AgentDefinition[]
): Promise<string[]> {
  const modifiedFiles: string[] = [];

  // 1. .cursorrules na raiz
  const cursorRulesPath = path.join(targetDir, ".cursorrules");
  let content = "";
  if (existsSync(cursorRulesPath)) {
    content = await fs.readFile(cursorRulesPath, "utf-8");
  }

  const startTag = "<!-- BEGIN AGENTIC-SUITE: RULES -->";
  const endTag = "<!-- END AGENTIC-SUITE: RULES -->";

  const rulesBody = [
    "# Cursor Rules - Agentic Engineering Suite",
    "Você opera sob as diretrizes da Agentic Engineering Suite.",
    "Respeite rigorosamente a divisão de papéis dos agentes ativos neste repositório:",
    "",
    ...activeAgents.map((a) => a.rulesSnippet),
  ].join("\n");

  const rulesBlock = `${startTag}\n${rulesBody}\n${endTag}`;

  if (content.includes(startTag) && content.includes(endTag)) {
    const regex = new RegExp(`${startTag}[\\s\\S]*?${endTag}`, "g");
    content = content.replace(regex, rulesBlock);
  } else if (content.trim().length === 0) {
    content = rulesBlock;
  } else {
    content = `${content.trim()}\n\n${rulesBlock}`;
  }

  await fs.writeFile(cursorRulesPath, `${content.trim()}\n`, "utf-8");
  modifiedFiles.push(cursorRulesPath);

  // 2. .cursor/rules/agentic-suite.mdc para versões modernas do Cursor
  const cursorRulesDir = path.join(targetDir, ".cursor", "rules");
  await fs.mkdir(cursorRulesDir, { recursive: true });
  const mdcPath = path.join(cursorRulesDir, "agentic-suite.mdc");

  const mdcContent = `---
description: Diretrizes de governança e papéis dos agentes da Agentic Engineering Suite
globs: *
alwaysApply: true
---
${rulesBody}
`;
  await fs.writeFile(mdcPath, mdcContent, "utf-8");
  modifiedFiles.push(mdcPath);

  return modifiedFiles;
}

export async function mergeClaudeMd(
  targetDir: string,
  activeAgents: AgentDefinition[]
): Promise<string> {
  const claudePath = path.join(targetDir, "CLAUDE.md");
  let content = "";

  if (existsSync(claudePath)) {
    content = await fs.readFile(claudePath, "utf-8");
  }

  const startTag = "<!-- BEGIN AGENTIC-SUITE -->";
  const endTag = "<!-- END AGENTIC-SUITE -->";

  const body = [
    "# Claude Code Guidelines - Agentic Engineering Suite",
    "",
    "Ao atuar neste repositório, consulte e respeite as diretrizes dos seguintes agentes especializados:",
    "",
    ...activeAgents.map((a) => a.rulesSnippet),
    "",
    "Consulte sempre `AGENTS.md` e `spec-docs/` como Fonte da Verdade (SSOT).",
  ].join("\n");

  const block = `${startTag}\n${body}\n${endTag}`;

  if (content.includes(startTag) && content.includes(endTag)) {
    const regex = new RegExp(`${startTag}[\\s\\S]*?${endTag}`, "g");
    content = content.replace(regex, block);
  } else if (content.trim().length === 0) {
    content = block;
  } else {
    content = `${content.trim()}\n\n${block}`;
  }

  await fs.writeFile(claudePath, `${content.trim()}\n`, "utf-8");
  return claudePath;
}
