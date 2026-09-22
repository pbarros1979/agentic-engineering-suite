#!/usr/bin/env node
import { Command } from "commander";
import pc from "picocolors";
import { checkbox, confirm } from "@inquirer/prompts";
import { getAllAgents, isValidAgentId } from "./catalog.js";
import { detectEnvironment } from "./detect.js";
import { scaffoldAgents } from "./scaffold.js";

const program = new Command();

program
  .name("agentic-suite")
  .description("CLI oficial para distribuição e governança da Agentic Engineering Suite")
  .version("1.0.1");

// 1. Comando INIT
program
  .command("init [targetDir]")
  .description("Inicializa a Agentic Engineering Suite no projeto (Green-Field ou Brown-Field)")
  .option("-a, --agents <agents...>", "Agentes para habilitar (ex: spec-maestro mcp-engineer)")
  .option("-i, --assistants <assistants...>", "Assistentes de IA (ex: cursor claude vscode antigravity)")
  .option("-m, --mcp", "Ativar configuração do servidor MCP", true)
  .option("--no-mcp", "Desativar configuração do servidor MCP")
  .option("-y, --yes", "Aceitar valores padrão de forma não interativa")
  .action(async (targetDir = ".", options) => {
    console.log(pc.bold(pc.cyan("\n🚀 Agentic Engineering Suite - Setup Híbrido\n")));

    const env = await detectEnvironment(targetDir);

    if (env.isBrownField) {
      console.log(pc.yellow("ℹ Repositório Git existente detectado (Brown-Field)."));
      console.log(pc.yellow("  Operando em modo seguro e estritamente não-destrutivo.\n"));
    }

    let selectedAgentIds: string[] = [];
    let enableMcp = options.mcp;
    let selectedAssistants: { cursor?: boolean; claude?: boolean; vscode?: boolean; antigravity?: boolean } = {
      cursor: true,
      claude: true,
      vscode: true,
      antigravity: true,
    };

    if (options.yes) {
      selectedAgentIds = getAllAgents().map((a) => a.id);
      enableMcp = options.mcp !== false;
    } else if (options.agents && options.agents.length > 0) {
      selectedAgentIds = options.agents;
      if (options.assistants) {
        selectedAssistants = {
          cursor: options.assistants.includes("cursor"),
          claude: options.assistants.includes("claude"),
          vscode: options.assistants.includes("vscode"),
          antigravity: options.assistants.includes("antigravity"),
        };
      }
    } else if (process.stdout.isTTY) {
      // Modo interativo via @inquirer/prompts
      const agentChoices = getAllAgents().map((a) => ({
        name: `${a.name} (${a.role}) - ${a.zeroCode ? "Zero-Code" : "Code"}`,
        value: a.id,
        checked: true,
      }));

      selectedAgentIds = await checkbox({
        message: "Selecione os agentes da suite que deseja habilitar neste projeto:",
        choices: agentChoices,
      });

      const assistantChoices = [
        { name: "Cursor (.cursorrules, .cursor/rules)", value: "cursor", checked: true },
        { name: "Antigravity (AGENTS.md, .agent/)", value: "antigravity", checked: true },
        { name: "Claude Code (CLAUDE.md)", value: "claude", checked: true },
        { name: "VS Code (.vscode/)", value: "vscode", checked: true },
      ];

      const chosenAssistants = await checkbox({
        message: "Quais assistentes de IA o time utiliza?",
        choices: assistantChoices,
      });

      selectedAssistants = {
        cursor: chosenAssistants.includes("cursor"),
        antigravity: chosenAssistants.includes("antigravity"),
        claude: chosenAssistants.includes("claude"),
        vscode: chosenAssistants.includes("vscode"),
      };

      enableMcp = await confirm({
        message: "Deseja ativar o servidor MCP unificado (@agentic-engineering-suite/mcp-server)?",
        default: true,
      });
    } else {
      // Fallback sem TTY: aceitar todos os agentes disponíveis
      selectedAgentIds = getAllAgents().map((a) => a.id);
    }

    if (selectedAgentIds.length === 0) {
      console.log(pc.yellow("Nenhum agente selecionado. Abortando."));
      return;
    }

    console.log(pc.blue("⏳ Injetando governança e agentes selecionados..."));

    try {
      const result = await scaffoldAgents({
        targetDir,
        selectedAgentIds,
        enableMcp,
        assistants: selectedAssistants,
      });

      console.log(pc.green("\n✔ Injeção concluída com sucesso!"));
      console.log(`\n${pc.bold("Agentes Ativos:")} ${result.installedAgents.join(", ")}`);
      console.log(`${pc.bold("Skills Instaladas:")} ${result.installedSkills.join(", ")}`);
      console.log(`\n${pc.bold("Arquivos Gerados / Atualizados:")}`);
      for (const f of [...result.createdFiles, ...result.updatedFiles]) {
        console.log(`  ✔ ${f}`);
      }

      console.log(pc.bold(pc.green(`\n🎉 ${result.installedAgents.length} agentes configurados com sucesso!\n`)));
    } catch (err) {
      console.error(pc.red(`\n❌ Erro durante o scaffolding:`), err);
      process.exit(1);
    }
  });

// 2. Comando ADD
program
  .command("add <agentId> [targetDir]")
  .description("Adiciona um novo agente ao projeto de forma incremental e não-destrutiva")
  .action(async (agentId, targetDir = ".") => {
    console.log(pc.cyan(`\n📦 Adicionando agente "${agentId}"...\n`));

    if (!isValidAgentId(agentId)) {
      console.error(
        pc.red(`❌ Agente "${agentId}" não encontrado no catálogo da suite.\n`) +
          `Execute "${pc.bold("agentic-suite list")}" para visualizar os agentes disponíveis.`
      );
      process.exit(1);
    }

    try {
      const env = await detectEnvironment(targetDir);
      const currentAgents = new Set(env.installedAgents);
      currentAgents.add(agentId);

      const result = await scaffoldAgents({
        targetDir,
        selectedAgentIds: Array.from(currentAgents),
        enableMcp: env.hasMcpConfig,
      });

      console.log(pc.green(`✔ Agente "${agentId}" incorporado com sucesso!`));
      console.log(`${pc.bold("Skills ativas:")} ${result.installedSkills.join(", ")}`);
      console.log(`${pc.bold("Regras mescladas em:")} AGENTS.md, .cursorrules, CLAUDE.md\n`);
    } catch (err) {
      console.error(pc.red(`❌ Falha ao adicionar agente:`), err);
      process.exit(1);
    }
  });

// 3. Comando LIST
program
  .command("list [targetDir]")
  .description("Lista todos os agentes disponíveis no catálogo e seus status no projeto")
  .action(async (targetDir = ".") => {
    const env = await detectEnvironment(targetDir);
    const allAgents = getAllAgents();

    console.log(pc.bold(pc.cyan("\n📋 Catálogo de Agentes - Agentic Engineering Suite\n")));

    for (const agent of allAgents) {
      const isInstalled = env.installedAgents.includes(agent.id);
      const statusTag = isInstalled
        ? pc.green(pc.bold("[INSTALADO]"))
        : pc.gray("[DISPONÍVEL]");

      console.log(`${statusTag} ${pc.bold(agent.name)} (${pc.cyan(agent.id)})`);
      console.log(`  Role: ${agent.role}`);
      console.log(`  Categoria: ${agent.category} | Namespace MCP: ${agent.mcpNamespace}_*`);
      console.log(`  Descrição: ${agent.description}`);
      console.log(`  Skills: ${agent.skills.join(", ")}`);
      console.log(`  Zero-Code: ${agent.zeroCode ? "Sim (Estrito)" : "Não (Implementação de Código)"}\n`);
    }
  });

// 4. Comando STATUS
program
  .command("status [targetDir]")
  .description("Verifica a integridade e os componentes da suite no projeto atual")
  .action(async (targetDir = ".") => {
    const env = await detectEnvironment(targetDir);

    console.log(pc.bold(pc.cyan("\n🩺 Diagnóstico de Governança da Suite\n")));
    console.log(`Diretório: ${pc.bold(env.targetDir)}`);
    console.log(`Repositório Git: ${env.isGitRepo ? pc.green("Detectado") : pc.yellow("Não detectado")}`);
    console.log(`Modo: ${env.isBrownField ? pc.yellow("Brown-Field (Legado)") : pc.blue("Green-Field (Novo)")}`);
    console.log(`Context Memory (spec-docs/): ${env.hasSpecDocs ? pc.green("Ativa") : pc.yellow("Ausente")}`);
    console.log(`Servidor MCP configurado: ${env.hasMcpConfig ? pc.green("Sim (.cursor/mcp.json)") : pc.gray("Não")}`);

    console.log(`\n${pc.bold("Agentes Instalados:")} ${env.installedAgents.length > 0 ? env.installedAgents.join(", ") : pc.gray("Nenhum")}`);
    console.log(`${pc.bold("Skills Instaladas:")} ${env.installedSkills.length > 0 ? env.installedSkills.join(", ") : pc.gray("Nenhuma")}`);

    console.log(`\n${pc.bold("Assistentes Detectados:")}`);
    console.log(`  Cursor: ${env.detectedAssistants.cursor ? pc.green("✔") : pc.gray("✗")}`);
    console.log(`  Antigravity: ${env.detectedAssistants.antigravity ? pc.green("✔") : pc.gray("✗")}`);
    console.log(`  Claude Code: ${env.detectedAssistants.claude ? pc.green("✔") : pc.gray("✗")}`);
    console.log(`  VS Code: ${env.detectedAssistants.vscode ? pc.green("✔") : pc.gray("✗")}\n`);
  });

program.parse(process.argv);
