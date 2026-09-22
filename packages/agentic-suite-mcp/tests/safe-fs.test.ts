import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import {
  resolveSafePath,
  safeEnsureDir,
  safeReadFile,
  safeWriteFile,
  safeExists,
} from "../src/utils/safe-fs.js";

describe("Safe-FS Sandbox Tests", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "mcp-safe-fs-test-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("deve resolver caminhos seguros dentro da sandbox", () => {
    const safe = resolveSafePath(tmpDir, "subfolder/file.txt");
    expect(safe.startsWith(tmpDir)).toBe(true);
  });

  it("deve bloquear tentativa de Path Traversal com erro explícito", () => {
    expect(() => {
      resolveSafePath(tmpDir, "../../etc/passwd");
    }).toThrow(/viola os limites da sandbox/i);
  });

  it("deve criar diretórios e gravar/ler arquivos com segurança", async () => {
    await safeEnsureDir(tmpDir, "docs/plans");
    expect(safeExists(tmpDir, "docs/plans")).toBe(true);

    const writtenPath = await safeWriteFile(tmpDir, "docs/plans/01_test.md", "# Hello");
    expect(safeExists(tmpDir, "docs/plans/01_test.md")).toBe(true);

    const content = await safeReadFile(tmpDir, "docs/plans/01_test.md");
    expect(content).toBe("# Hello");
  });
});
