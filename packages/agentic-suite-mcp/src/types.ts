import { z } from "zod";

export interface ToolContext {
  baseDir: string;
}

export interface ToolResult {
  isError?: boolean;
  content: {
    type: "text";
    text: string;
  }[];
  [x: string]: unknown;
}

export interface ToolDefinition<T = any> {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties?: Record<string, unknown>;
    required?: string[];
  };
  schema: z.ZodType<T>;
  handler: (args: T, context: ToolContext) => Promise<ToolResult>;
}

export interface PromptArgument {
  name: string;
  description: string;
  required?: boolean;
}

export interface PromptResult {
  description?: string;
  messages: {
    role: "user" | "assistant";
    content: {
      type: "text";
      text: string;
    };
  }[];
  [x: string]: unknown;
}

export interface PromptDefinition {
  name: string;
  description: string;
  arguments?: PromptArgument[];
  handler: (args: Record<string, string>) => Promise<PromptResult>;
}

export interface ResourceContent {
  uri: string;
  mimeType?: string;
  text: string;
}

export interface ResourceDefinition {
  uri: string;
  name: string;
  description: string;
  mimeType?: string;
  read: () => Promise<ResourceContent>;
}

export interface ModuleDefinition {
  id: string;
  name: string;
  namespace: string;
  description: string;
  tools: ToolDefinition[];
  prompts: PromptDefinition[];
  resources: ResourceDefinition[];
}
