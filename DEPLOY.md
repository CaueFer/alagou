# Deploy em produção

Arquitetura de custo zero:

* **Frontend** (`app/`): Cloudflare Pages, com build automático a cada push na `main`.
* **Backend** (`api/`): Render (plano free, Docker), descrito no blueprint `render.yaml`.
* **Banco**: Supabase (Postgres 15+ com PostGIS, plano free).
* **Keep-alive**: o workflow `.github/workflows/keep-alive.yml` chama `/api/health` a cada 10 minutos. Sem ele, o Render free hiberna após 15 minutos sem tráfego e os schedulers (expiração de alertas, agregação de dados oficiais, maré) param de rodar.

Ordem: banco, depois backend, depois frontend, depois os ajustes finais.

---

## 1. Banco (Supabase)

1. Entrar em https://supabase.com com a conta do GitHub e criar um projeto:
   * Name: `alagou`
   * Region: **East US (North Virginia)**, a mesma região do Render, para reduzir a latência entre a API e o banco.
   * Guardar a senha do banco gerada.
2. Em **Connect** (topo da página do projeto), escolher **Session pooler** (o Render não tem IPv6, então a conexão direta não funciona). A tela mostra algo como:
   `postgresql://postgres.abcdefgh:[SENHA]@aws-0-us-east-1.pooler.supabase.com:5432/postgres`
3. Converter para as três variáveis da API:
   * `DB_URL` = `jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require`
   * `DB_USERNAME` = `postgres.abcdefgh` (com o sufixo do projeto)
   * `DB_PASSWORD` = a senha do passo 1

Não é preciso rodar nenhum SQL. O Flyway cria a extensão PostGIS e todas as tabelas quando a API sobe pela primeira vez.

---

## 2. Backend (Render)

1. Entrar em https://render.com com a conta do GitHub.
2. **New > Blueprint** e selecionar o repositório `CaueFer/alagou`. O Render lê o `render.yaml` e cria o serviço `alagou-api`.
3. Preencher as variáveis marcadas como pendentes:
   * `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`: valores do passo 1.3.
   * `GOOGLE_CLIENT_ID`: o mesmo do `.env` local.
   * `WORLDTIDES_API_KEY`: o mesmo do `.env` local.
   * `JWT_SECRET` é gerado automaticamente pelo Render.
4. **Apply**. O primeiro build leva cerca de 5 minutos. Quando terminar, a API estará em `https://alagou-api.onrender.com` (ou a URL que o Render mostrar, se esse nome já estiver em uso).
5. Conferir: abrir `https://alagou-api.onrender.com/api/health`. A resposta deve ser `Alagou API funcionando!`.

---

## 3. Frontend (Cloudflare Pages)

1. Em https://dash.cloudflare.com, abrir **Workers & Pages > Create > Pages > Connect to Git** e selecionar `CaueFer/alagou`.
2. Configuração do build:
   * Project name: `alagou` (gera `https://alagou.pages.dev`, que já está liberado no CORS da API)
   * Production branch: `main`
   * Framework preset: `None`
   * Root directory: `app`
   * Build command: `npm run build`
   * Build output directory: `dist`
3. Variáveis de ambiente (Production e Preview):
   * `VITE_API_BASE_URL` = URL do Render do passo 2.4, sem barra no final
   * `VITE_GOOGLE_CLIENT_ID` = o mesmo do `.env` local
4. **Save and Deploy**.

O roteamento SPA (por exemplo `/admin`) é resolvido pelo `app/public/_redirects`, e a versão do Node vem de `app/.node-version`.

---

## 4. Ajustes finais

1. **Keep-alive**: registrar a URL da API como variável do repositório:
   ```bash
   gh variable set API_URL --body "https://alagou-api.onrender.com"
   ```
2. **Login com Google**: em https://console.cloud.google.com/apis/credentials, abrir o OAuth Client ID usado e adicionar `https://alagou.pages.dev` em **Authorized JavaScript origins**.
3. **Conta ADMIN**: o banco de produção começa vazio. Criar a conta pelo app e promover pelo SQL Editor do Supabase:
   ```sql
   UPDATE usuario SET role = 'ADMIN' WHERE email = 'seu-email@exemplo.com';
   ```

---

## Pontos de atenção

* **Fotos dos relatos**: ficam no disco do container, que no Render free é efêmero. As fotos se perdem a cada deploy ou restart. Para guardar de forma permanente, o próximo passo é mover o `PhotoStorageService` para o Cloudflare R2 (grátis até 10 GB, compatível com S3).
* **Nome do projeto no Pages**: se `alagou` já estiver em uso e o Pages gerar outro domínio, atualizar `CORS_ALLOWED_ORIGINS` no Render com o domínio novo.
* **Horas grátis do Render**: são 750 h por mês, o suficiente para um serviço ligado 24/7. Não crie um segundo serviço free na mesma conta.
* **Push notifications**: desligadas (`PUSH_ENABLED=false`), porque exigem RabbitMQ. Para ligar, usar um broker gratuito (ex.: CloudAMQP) e preencher as variáveis `RABBITMQ_*` e `VAPID_*`.
* **IP real do cliente**: `TRUSTED_PROXIES` confia nas faixas privadas, onde ficam os proxies do Render, para que o rate limit seja aplicado por usuário e não de forma global.
