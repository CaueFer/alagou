# Alagou — Guia do Desenvolvedor

## Sobre

Alagou é uma plataforma de crowdsourcing geoespacial que centraliza relatos de alagamento nas vias de Joinville/SC, permitindo que cidadãos reportem, confirmem e consultem alagamentos em tempo real.

* **Backend:** `api/` — Java 21 + Spring Boot 3 + PostgreSQL/PostGIS
* **Frontend:** `app/` — React PWA mobile-first (em desenvolvimento)

Para o detalhamento completo do projeto (problema, requisitos, arquitetura, planejamento), veja o [RFC](README.RFC.md).

---

## Como Rodar

Dica: use Docker para subir o banco de dados sem precisar instalar PostgreSQL/PostGIS localmente.

### Pré-requisitos

* Docker
* Java 21+
* Maven

### Passo a passo

1. Clone o repositório e entre na pasta do projeto.

2. Suba o banco de dados com Docker Compose:

   ```bash
   docker compose up -d
   ```

3. Configure as variáveis de ambiente (arquivo único na raiz, usado pelo backend e pelo frontend):

   ```bash
   cp .env.example .env
   ```

4. Rode a API:

   ```bash
   cd api
   mvn spring-boot:run
   ```

   A API lê `../.env` (resolvido a partir de `api/` via `api/src/main/resources/.env.properties`), então rode-a de dentro de `api/`.

5. A API estará disponível em `http://localhost:8080`.

6. Rode o frontend (lê o mesmo `.env` da raiz via `envDir`):

   ```bash
   cd app
   npm install
   npm run dev
   ```

   App em `http://localhost:5173`.

---

## Documentação Adicional

* [RFC do Projeto](README.RFC.md) — visão de produto, requisitos, arquitetura e planejamento
* [dev-docs/](dev-docs/) — especificação detalhada por módulo
