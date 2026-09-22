import path from "node:path";
import fs from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { getAllAgents } from "./catalog.js";

export interface ProjectEnvironment {
  targetDir: string;
  isGitRepo: boolean;
  isBrownField: boolean;
  hasSpecDocs: boolean;
  installedAgents: string[];
  installedSkills: string[];
  detectedAssistants: {
    cursor: boolean;
    claude: boolean;
    vscode: boolean;
    antigravity: boolean;
  };
  hasMcpConfig: boolean;
  detectedLanguages: string[];
}

export async function detectEnvironment(targetDir: string = process.cwd()): Promise<ProjectEnvironment> {
  const resolved = path.resolve(targetDir);

  const isGitRepo = existsSync(path.join(resolved, ".git"));

  // Detectar Brown-field: tem git ou arquivos pré-existentes além de diretórios vazios
  let isBrownField = false;
  try {
    const entries = await fs.readdir(resolved);
    const nonTrivialEntries = entries.filter(
      (e) => !e.startsWith(".") || e === ".git"
    );
    isBrownField = isGitRepo && nonTrivialEntries.length > 1;
  } catch {
    isBrownField = false;
  }

  // Detectar spec-docs
  const hasSpecDocs = existsSync(path.join(resolved, "spec-docs"));

  // Detectar agentes instalados
  const installedAgents: string[] = [];
  const agentsDir = path.join(resolved, ".agent", "agents");
  if (existsSync(agentsDir)) {
    try {
      const files = await fs.readdir(agentsDir);
      for (const file of files) {
        if (file.endsWith(".md")) {
          const agentId = file.replace(/\.md$/, "");
          if (getAllAgents().some((a) => a.id === agentId)) {
            installedAgents.push(agentId);
          }
        }
      }
    } catch {
      // ignore
    }
  }

  // Detectar skills instaladas
  const installedSkills = new Set<string>();
  const skillsDir = path.join(resolved, ".agent", "skills");
  if (existsSync(skillsDir)) {
    try {
      const entries = await fs.readdir(skillsDir);
      for (const name of entries) {
        const fullPath = path.join(skillsDir, name);
        try {
          const stat = statSync(fullPath);
          if (stat.isDirectory()) {
            installedSkills.add(name);
          }
        } catch {
          installedSkills.add(name);
        }
      }
    } catch {
      // ignore
    }
  }

  // Também inspecionar .agent/skills.json
  const skillsJson = path.join(resolved, ".agent", "skills.json");
  if (existsSync(skillsJson)) {
    try {
      const raw = await fs.readFile(skillsJson, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.entries)) {
        for (const entry of parsed.entries) {
          if (entry.path) {
            const entryFullPath = path.resolve(resolved, entry.path);
            if (existsSync(entryFullPath)) {
              const subEntries = await fs.readdir(entryFullPath);
              for (const sub of subEntries) {
                installedSkills.add(sub);
              }
            }
          }
        }
      }
    } catch {
      // ignore
    }
  }

  // Detectar assistentes
  const cursorExists =
    existsSync(path.join(resolved, ".cursor")) ||
    existsSync(path.join(resolved, ".cursorrules"));

  const claudeExists =
    existsSync(path.join(resolved, ".claude")) ||
    existsSync(path.join(resolved, "CLAUDE.md"));

  const vscodeExists = existsSync(path.join(resolved, ".vscode"));

  const antigravityExists =
    existsSync(path.join(resolved, ".agent")) ||
    existsSync(path.join(resolved, "AGENTS.md"));

  // Detectar MCP config
  let hasMcpConfig = false;
  const cursorMcp = path.join(resolved, ".cursor", "mcp.json");
  if (existsSync(cursorMcp)) {
    try {
      const raw = await fs.readFile(cursorMcp, "utf-8");
      const parsed = JSON.parse(raw);
      if (
        parsed.mcpServers &&
        (parsed.mcpServers["agentic-suite"] ||
          parsed.mcpServers["@agentic-suite/mcp-server"] ||
          parsed.mcpServers["@agentic-engineering-suite/mcp-server"])
      ) {
        hasMcpConfig = true;
      }
    } catch {
      // ignore
    }
  }

  // Detectar linguagens comuns
  const detectedLanguages: string[] = [];
  if (existsSync(path.join(resolved, "package.json"))) detectedLanguages.push("TypeScript/JavaScript");
  if (existsSync(path.join(resolved, "pyproject.toml")) || existsSync(path.join(resolved, "requirements.txt"))) detectedLanguages.push("Python");
  if (existsSync(path.join(resolved, "go.mod"))) detectedLanguages.push("Go");
  if (existsSync(path.join(resolved, "pom.xml")) || existsSync(path.join(resolved, "build.gradle"))) detectedLanguages.push("Java");
  if (existsSync(path.join(resolved, "Cargo.toml"))) detectedLanguages.push("Rust");

  return {
    targetDir: resolved,
    isGitRepo,
    isBrownField,
    hasSpecDocs,
    installedAgents,
    installedSkills: Array.from(installedSkills),
    detectedAssistants: {
      cursor: cursorExists,
      claude: claudeExists,
      vscode: vscodeExists,
      antigravity: antigravityExists,
    },
    hasMcpConfig,
    detectedLanguages,
  };
}
