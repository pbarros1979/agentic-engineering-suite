# Deployment Unit Specification: [Nome da Unit]

**Unit ID**: [UNIT-ID: Nome da Unit]  
**Versão da Release**: [v1.0.0]  
**Data de Empacotamento**: [YYYY-MM-DD]  
**Ambiente Alvo**: [AWS / Kubernetes / Hybrid]  
**Status**: [Packaged / Validated / Ready for Deployment]  

---

## 1. Visão Geral da Deployment Unit
Uma **Deployment Unit** no AI-DLC é o artefato operacional autocontido que consolida o código executável testado, configurações de runtime, definições de infraestrutura como código (IaC) e suítes de validação automatizada.

---

## 2. Composição dos Artefatos Operacionais

### 2.1 Código Executável e Imagens de Runtime
- **Formato**: [Imagem de Container OCI / Pacote Zip AWS Lambda / Binário compilado]
- **Registro de Imagens**: `123456789012.dkr.ecr.us-east-1.amazonaws.com/app/unit-recommendation:v1.0.0`
- **Digest / SHA-256**: `sha256:4f8a3c9...`
- **Base Image**: `gcr.io/distroless/static-debian11` (Hardened, sem shell)
- **Scanning de Segurança**: Imagem aprovada com 0 vulnerabilidades críticas ou altas no Trivy/ECR Scan.

### 2.2 Configurações de Orquestração e Ambiente
- **Tipo de Configuração**: [Helm Chart / Kubernetes Manifests / AWS AppConfig]
- **Caminho dos Arquivos**: `deploy/helm/unit-recommendation/`
- **Variáveis de Ambiente Injetadas**:
  - `ENV`: `production`
  - `LOG_LEVEL`: `INFO`
  - `EVENT_BUS_NAME`: `arn:aws:events:us-east-1:...:event-bus/corporate-bus`
- **Configuração de Recursos**:
  - CPU Request: `250m` / Limit: `1000m`
  - Memória Request: `512Mi` / Limit: `1024Mi`

### 2.3 Infraestrutura como Código Vinculada (IaC Stacks)
- **Módulos Terraform / CDK**:
  - `infrastructure/terraform/modules/dynamodb`
  - `infrastructure/terraform/modules/iam_roles`
  - `infrastructure/terraform/modules/api_gateway`
- **State Lock & Versioning**: Gerenciado via S3 Bucket seguro e tabela de lock.

---

## 3. Matriz de Aceite para Rollout
- [x] Testes unitários com 100% de sucesso.
- [x] Testes de integração e contratos de API validados com unidades parceiras.
- [x] Scan de segurança estática e dinâmica sem apontamentos bloqueantes.
- [x] Teste de carga executado com sucesso nos parâmetros do NFR.
- [x] Plano de rollback testado e validado.

---

## 4. Checkpoint de Liberação Operacional
- **Aprovador de Operações / Tech Lead**: [Nome do Aprovador]
- **Comando de Rollout Homologado**: `terraform apply -auto-approve` / `helm upgrade --install ...`
