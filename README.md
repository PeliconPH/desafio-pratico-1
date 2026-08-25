# brev.ly — Encurtador de URL

Monorepo com a solução completa do desafio (back-end, front-end e DevOps).

```
.
├── server/   # API (Fastify + TypeScript + Drizzle + Postgres) + Dockerfile
└── web/      # SPA React (Vite + TypeScript + Tailwind + React Query)
```

## Requisitos

- Node.js 20+
- Docker (para o Postgres local)

## Como rodar

### 1. Back-end (`server/`)

```bash
cd server
cp .env.example .env          # ajuste se necessário
npm install
docker compose up -d          # sobe o Postgres (porta 5433 no host)
npm run db:migrate            # aplica as migrations
npm run dev                   # http://localhost:3333
```

> Obs.: o `docker-compose.yml` mapeia o Postgres para a porta **5433** do host
> para evitar conflito com uma instância local já rodando na 5432. Ajuste o
> `DATABASE_URL` do `.env` se preferir outra porta.

### 2. Front-end (`web/`)

```bash
cd web
cp .env.example .env
npm install
npm run dev                   # http://localhost:5173
```

## Funcionalidades

- Criar link (valida URL original e formato do encurtamento)
- Bloqueia encurtamento duplicado (409) e mal formatado (400)
- Listar, obter por encurtamento, incrementar acessos e deletar
- Exportar CSV (URL original, encurtada, acessos, data de criação)
- CSV com nome aleatório e único, servido via CDN (Cloudflare R2)
- CORS habilitado

## Storage do CSV (Cloudflare R2)

A integração com o R2 é real (`@aws-sdk/client-s3`). Enquanto as credenciais do
R2 não estão preenchidas no `.env`, o CSV é gravado localmente em `server/tmp/`
e servido por `GET /uploads/:file` — assim dá para desenvolver sem bucket. Ao
preencher `CLOUDFLARE_*`, o upload passa a ir para o bucket automaticamente.

## Identificador das operações

Delete, incremento e busca usam a **URL encurtada** (`shortUrl`) como
identificador, de forma consistente em toda a API e no front-end.

## Endpoints

| Método | Rota                        | Descrição                          |
|--------|-----------------------------|------------------------------------|
| POST   | `/links`                    | Cria um link                       |
| GET    | `/links`                    | Lista todos os links               |
| GET    | `/links/:shortUrl`          | Obtém a URL original               |
| PATCH  | `/links/:shortUrl/access`   | Incrementa a contagem de acessos   |
| DELETE | `/links/:shortUrl`          | Deleta um link                     |
| POST   | `/links/exports`            | Gera o CSV e retorna a URL da CDN  |
