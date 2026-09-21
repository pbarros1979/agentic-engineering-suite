---
name: security-mcp-guard
description: Análise estática, sandbox e auditoria de segurança para servidores MCP, prevenindo Path Traversal, injeção de comandos e vazamento de segredos.
---

# Skill: Security MCP Guard

Esta skill define os controles de segurança e proteção de sandbox essenciais para qualquer ferramenta exposta através do **Model Context Protocol (MCP)**.

---

## 1. Principais Vetores de Risco em Servidores MCP

1. **Path Traversal (Acesso Não Autorizado ao Sistema de Arquivos)**:
   - Ferramentas que aceitam caminhos de arquivos como entrada nunca devem permitir escapar do diretório raiz permitido (`baseDir`).
   - Exemplo de ataque: `../../../../etc/passwd` ou `..\..\Windows\System32`.

2. **Injeção de Comandos (Command Injection)**:
   - Jamais execute strings concatenadas diretamente via `child_process.exec()`.
   - Utilize funções parametrizadas (`child_process.execFile` ou `spawn`) com validação de binários e argumentos restritos a uma lista permitida (*allowlist*).

3. **Vazamento de Variáveis de Ambiente e Segredos**:
   - Nunca exponha chaves de API, senhas de banco ou dados sensíveis em respostas de ferramentas ou logs.

---

## 2. Padrão Canônico de Sanitização de Caminhos

```typescript
import path from "node:path";

/**
 * Valida se o caminho solicitado está estritamente contido no diretório base seguro.
 * @throws Error se houver tentativa de escape de sandbox.
 */
export function resolveSafePath(baseDir: string, relativePath: string): string {
  const resolvedBase = path.resolve(baseDir);
  const targetPath = path.resolve(resolvedBase, relativePath);

  if (!targetPath.startsWith(resolvedBase + path.sep) && targetPath !== resolvedBase) {
    throw new Error(`Acesso negado: o caminho "${relativePath}" viola os limites da sandbox.`);
  }

  return targetPath;
}
```

---

## 3. Checklist de Auditoria de Segurança
- [ ] Todas as operações de leitura/escrita utilizam verificação de limite de diretório (`path traversal protection`).
- [ ] Nenhum comando arbitrário é executado em shell não controlado.
- [ ] Nenhuma credencial ou token é hardcoded no código ou enviado para canais de resposta.
- [ ] Mensagens de erro de exceções internas são tratadas para não expor stack traces sensíveis.

