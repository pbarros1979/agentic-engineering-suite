import path from "node:path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";

/**
 * Validates that a requested path stays strictly within the specified base directory,
 * preventing Path Traversal vulnerabilities (e.g., ../../../etc/passwd).
 */
export function resolveSafePath(baseDir: string, relativePath: string = ""): string {
  const resolvedBase = path.resolve(baseDir);
  const targetPath = path.resolve(resolvedBase, relativePath);

  const relative = path.relative(resolvedBase, targetPath);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Acesso negado: o caminho "${relativePath}" viola os limites da sandbox em "${baseDir}".`);
  }

  return targetPath;
}

/**
 * Safely ensures a directory exists within baseDir.
 */
export async function safeEnsureDir(baseDir: string, relativePath: string = ""): Promise<string> {
  const safePath = resolveSafePath(baseDir, relativePath);
  await fs.mkdir(safePath, { recursive: true });
  return safePath;
}

/**
 * Safely reads a file within baseDir.
 */
export async function safeReadFile(baseDir: string, relativePath: string): Promise<string> {
  const safePath = resolveSafePath(baseDir, relativePath);
  return await fs.readFile(safePath, "utf-8");
}

/**
 * Safely writes a file within baseDir, creating parent directories if needed.
 */
export async function safeWriteFile(
  baseDir: string,
  relativePath: string,
  content: string
): Promise<string> {
  const safePath = resolveSafePath(baseDir, relativePath);
  await fs.mkdir(path.dirname(safePath), { recursive: true });
  await fs.writeFile(safePath, content, "utf-8");
  return safePath;
}

/**
 * Safely checks if a file or directory exists within baseDir.
 */
export function safeExists(baseDir: string, relativePath: string): boolean {
  try {
    const safePath = resolveSafePath(baseDir, relativePath);
    return existsSync(safePath);
  } catch {
    return false;
  }
}
