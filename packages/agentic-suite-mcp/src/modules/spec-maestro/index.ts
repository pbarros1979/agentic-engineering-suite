import { ModuleDefinition } from "../../types.js";
import { specTools } from "./tools.js";
import { specPrompts } from "./prompts.js";
import { specResources } from "./resources.js";

export const specMaestroModule: ModuleDefinition = {
  id: "spec-maestro",
  name: "Spec Maestro",
  namespace: "spec",
  description: "Especialista em Inception, Mob Elaboration, DDD, pacotes contratuais SDD e auditoria de convergência (Zero-Code de produção).",
  tools: specTools,
  prompts: specPrompts,
  resources: specResources,
};
