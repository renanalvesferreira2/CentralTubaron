# Central do Assinante Tubaron

Sistema full stack para autoatendimento de clientes Tubaron, com dashboard do assinante, faturas, contratos, suporte premium para ONUs Huawei, assistente com Gemini e painel administrativo protegido.

## Stack

- Frontend: React, JavaScript, Vite, Lucide Icons
- Backend: Node.js, Express, JWT, Zod, Helmet, Rate Limit
- Banco: PostgreSQL
- Integrações: IXC, Huawei, Gemini
- Infra: Docker e Docker Compose

## Como executar com Docker

1. Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

2. Ajuste os segredos no `.env`, principalmente `JWT_SECRET`, credenciais IXC, Huawei e Gemini.

3. Suba o ambiente:

```bash
docker compose up --build
```

4. Acesse:

- Frontend: `http://localhost:5173`
- Backend healthcheck: `http://localhost:4000/api/health`
- PostgreSQL: `localhost:5432`

## Execução local sem Docker

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Variáveis de ambiente

Todas as informações sensíveis ficam fora do código e devem ser configuradas por ambiente.

- `DATABASE_URL`: conexão PostgreSQL
- `JWT_SECRET`: segredo forte para assinatura JWT
- `JWT_EXPIRES_IN`: expiração do token
- `IXC_BASE_URL`, `IXC_TOKEN`, `IXC_USE_MOCK`
- `HUAWEI_BASE_URL`, `HUAWEI_TOKEN`, `HUAWEI_USE_MOCK`
- `GEMINI_API_KEY`, `GEMINI_MODEL`, `GEMINI_USE_MOCK`
- `FRONTEND_URL`: origem autorizada no CORS

Os mocks vêm ativados no `.env.example` para apresentação segura sem credenciais reais.

## Estrutura

```text
frontend/
  src/
    api/ contexts/ components/ hooks/ layouts/ pages/ services/ styles/
backend/
  src/
    config/ controllers/ integrations/ middlewares/ repositories/ routes/ services/ utils/
database/
  schema.sql
docker/
  backend.Dockerfile
  frontend.Dockerfile
```

## Segurança

O backend concentra todas as integrações externas. Nenhuma chave IXC, Huawei ou Gemini é enviada ao frontend.

Controles implementados:

- JWT com expiração.
- RBAC para rotas administrativas.
- Login administrativo com bcrypt.
- Rate limit global e rate limit específico para autenticação.
- Helmet com cabeçalhos HTTP de segurança.
- CORS restrito por `FRONTEND_URL`.
- Validação de entrada com Zod.
- Sanitização recursiva contra prototype pollution.
- Consultas SQL parametrizadas com `pg`.
- Auditoria para login, ações administrativas e operações Huawei.
- Timeout, retry controlado, logs e allowlist de host nas integrações externas.
- Proteção contra SSRF nas chamadas externas por validação de protocolo HTTPS e hostname esperado.
- Preparação para 2FA administrativo: a autenticação admin já está separada e pode receber um segundo fator sem alterar os clientes.

CSRF: o projeto usa tokens Bearer no cabeçalho `Authorization`, sem cookies de sessão por padrão. Caso cookies sejam adotados futuramente, habilite SameSite, CSRF token e rotação adequada.

## Integrações

Cada integração possui cliente próprio em `backend/src/integrations`:

- `ixc`: autenticação do assinante, dados cadastrais, contratos e faturas.
- `huawei`: dados da ONU, alteração de Wi-Fi e reinicialização.
- `gemini`: respostas assistivas para dúvidas do cliente.

Os serviços de domínio consomem esses clientes, mantendo controladores desacoplados dos fornecedores.

## Banco de dados

O schema inicial cria tabelas para:

- Usuários administrativos
- Sessões
- Auditoria
- Histórico de IA
- Configurações
- Avisos
- Preferências do cliente

Em produção, recomenda-se usar migrations versionadas e backups automáticos.

## Fluxos principais

- Cliente entra com CPF, CNPJ ou login PPPoE validado via IXC.
- Dashboard mostra status da conexão, plano, vencimento, contratos, faturas e avisos.
- Faturas exibem PIX/código de barras quando retornados pelo IXC.
- Suporte Premium consulta ONU Huawei, exibe sinal/status, altera Wi-Fi e permite reinício auditado.
- IA explica faturas, planos, Wi-Fi e testes básicos, orientando atendimento humano quando necessário.
- Painel admin concentra integrações, métricas, avisos, logs e permissões.

## Checklist para produção

- Trocar `JWT_SECRET` por segredo forte gerenciado em vault.
- Desativar `*_USE_MOCK`.
- Configurar HTTPS e proxy reverso.
- Criar usuário admin inicial com senha bcrypt.
- Ativar observabilidade centralizada para logs e métricas.
- Adicionar rotação de tokens e refresh token se a política de sessão exigir.
- Implementar 2FA para administradores.
- Definir política de retenção de logs e histórico de IA.
- Executar testes automatizados e análise SAST/DAST no pipeline.

## Apresentação

O projeto foi organizado para demonstração executiva com dados mockados e fluxos navegáveis. Para ambiente real, basta configurar as variáveis das integrações e substituir os endpoints conforme contrato oficial de cada fornecedor.
