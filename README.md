# Central do Assinante Tubaron

Sistema full stack para autoatendimento de clientes Tubaron, com dashboard do assinante, faturas, contratos, suporte premium para ONUs Huawei, assistente com Gemini e painel administrativo protegido.

## Stack

- Frontend: React, JavaScript, Vite, Lucide Icons
- Backend: Node.js, Express, JWT, Zod, Helmet, Rate Limit
- Banco: PostgreSQL
- Integracoes: IXC, Huawei, Gemini
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

## Execucao local sem Docker

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

## Variaveis de ambiente

Todas as informacoes sensiveis ficam fora do codigo e devem ser configuradas por ambiente.

- `DATABASE_URL`: conexao PostgreSQL
- `JWT_SECRET`: segredo forte para assinatura JWT, com no minimo 32 caracteres em producao
- `JWT_EXPIRES_IN`: expiracao do token
- `IXC_BASE_URL`, `IXC_TOKEN`, `IXC_USE_MOCK`
- `HUAWEI_BASE_URL`, `HUAWEI_TOKEN`, `HUAWEI_USE_MOCK`
- `GEMINI_API_KEY`, `GEMINI_MODEL`, `GEMINI_USE_MOCK`
- `FRONTEND_URL`: uma ou mais origens autorizadas no CORS, separadas por virgula

Os mocks vem ativados no `.env.example` para apresentacao segura sem credenciais reais.

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

## Seguranca

O backend concentra todas as integracoes externas. Nenhuma chave IXC, Huawei ou Gemini e enviada ao frontend.

Controles implementados:

- JWT com expiracao, issuer e audience.
- Validacao do payload do token antes de liberar rotas protegidas.
- RBAC para rotas administrativas e menu Admin visivel apenas para administradores.
- Login administrativo com bcrypt.
- Rate limit global e rate limit especifico para autenticacao.
- Helmet com cabecalhos HTTP de seguranca.
- CORS restrito por `FRONTEND_URL`, sem credenciais de cookie.
- Validacao de entrada com Zod, `trim`, tamanho maximo e objetos estritos.
- Sanitizacao recursiva contra prototype pollution.
- Consultas SQL parametrizadas com `pg`.
- Auditoria para login, acoes administrativas e operacoes Huawei.
- Timeout, retry controlado, logs sem query string e allowlist de host nas integracoes externas.
- Protecao contra SSRF nas chamadas externas por validacao de protocolo HTTPS e hostname esperado.
- Contexto reduzido para IA, sem documento, e-mail, telefone, PIX, codigo de barras ou identificadores de fatura.
- Containers com usuario nao-root e `no-new-privileges`.

CSRF: o projeto usa tokens Bearer no cabecalho `Authorization`, sem cookies de sessao por padrao. Caso cookies sejam adotados futuramente, habilite SameSite, CSRF token e rotacao adequada.

## Integracoes

Cada integracao possui cliente proprio em `backend/src/integrations`:

- `ixc`: autenticacao do assinante, dados cadastrais, contratos e faturas.
- `huawei`: dados da ONU, alteracao de Wi-Fi e reinicializacao.
- `gemini`: respostas assistivas para duvidas do cliente.

Os servicos de dominio consomem esses clientes, mantendo controladores desacoplados dos fornecedores.

## Banco de dados

O schema inicial cria tabelas para:

- Usuarios administrativos
- Sessoes
- Auditoria
- Historico de IA
- Configuracoes
- Avisos
- Preferencias do cliente

O schema tambem define checks de integridade e indices para logs, historico de IA, sessoes expiradas e avisos ativos.

## Fluxos principais

- Cliente entra com CPF, CNPJ ou login PPPoE validado via IXC.
- Admin entra pelo modo administrativo do login e acessa o painel protegido.
- Dashboard mostra status da conexao, plano, vencimento, contratos, faturas e avisos.
- Faturas exibem PIX/codigo de barras quando retornados pelo IXC e permitem copiar o PIX.
- Suporte Premium consulta ONU Huawei, exibe sinal/status, altera Wi-Fi e permite reinicio auditado.
- IA explica faturas, planos, Wi-Fi e testes basicos, orientando atendimento humano quando necessario.
- Painel admin concentra integracoes, metricas, avisos, logs e permissoes.

## Checklist para producao

- Trocar `JWT_SECRET` por segredo forte gerenciado em vault.
- Desativar `*_USE_MOCK`.
- Configurar HTTPS e proxy reverso.
- Criar usuario admin inicial com senha bcrypt.
- Ativar observabilidade centralizada para logs e metricas.
- Adicionar rotacao de tokens e refresh token se a politica de sessao exigir.
- Implementar 2FA para administradores.
- Definir politica de retencao de logs e historico de IA.
- Executar testes automatizados e analise SAST/DAST no pipeline.

## Apresentacao

O projeto foi organizado para demonstracao executiva com dados mockados e fluxos navegaveis. Para ambiente real, basta configurar as variaveis das integracoes e substituir os endpoints conforme contrato oficial de cada fornecedor.
