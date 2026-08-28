# SocialHub

Fondamenta di un SaaS multi-tenant per creare, programmare, pubblicare e analizzare contenuti social. Questa iterazione usa esclusivamente un provider mock: non chiama API social e non richiede token.

## Prerequisiti

- Node.js 20+
- pnpm 9+
- Docker con Compose (consigliato per PostgreSQL e Redis)

## Installazione e avvio

```bash
pnpm install
cp .env.example .env
docker compose up -d
pnpm prisma:generate
pnpm prisma:migrate --name init
pnpm dev
```

Su PowerShell usare `Copy-Item .env.example .env`. Aprire `http://localhost:3000`. La demo locale richiede `NODE_ENV` non production e `ENABLE_DEV_AUTH=true`; in produzione non viene mai creata un'identità fittizia.

## Variabili d'ambiente

- `DATABASE_URL`: connessione PostgreSQL.
- `REDIS_URL`: Redis destinato a BullMQ (la coda verrà attivata in un'iterazione successiva).
- `AUTH_SECRET`: segreto lungo e casuale di Auth.js.
- `AUTH_URL`: URL pubblico dell'app.
- `ENABLE_DEV_AUTH`: abilita esclusivamente l'utente demo locale in development.

Non archiviare `.env`. Le future credenziali social devono essere cifrate con KMS oppure conservate in un secret manager e referenziate dal database.

## Comandi

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm prisma:generate
pnpm prisma:migrate --name init
pnpm prisma:seed
```

## Struttura

- `app/`: App Router, pagine e Server Actions.
- `modules/auth`: configurazione Auth.js e identità demo isolata.
- `modules/workspaces`: selezione e autorizzazione tenant.
- `modules/social-accounts`: contratto provider e adapter mock; directory vuote riservate agli adapter futuri.
- `modules/content`, `publishing`, `analytics`, `audit`, `shared`: dominio e servizi applicativi riutilizzabili anche da un futuro server MCP.
- `prisma/`: modello dati PostgreSQL.
- `docs/`: architettura, sicurezza e contratto provider.

Le query sensibili includono sempre `workspaceId` e sono precedute dalla verifica di membership. La pubblicazione immediata è una Server Action e richiede conferma esplicita.

## Stato della prima iterazione

Sono presenti home, dashboard protetta in modalità demo, workspace, account social simulati, bozze, scheduling dati, pubblicazione mock, analytics coerenti e audit log. BullMQ/Redis sono dipendenze infrastrutturali predisposte ma non vengono usate finché non sarà definito il worker reale.

## Passi futuri

1. Provider OAuth reale e vault/KMS per Meta; pubblicazione e analytics Meta.
2. Adapter TikTok e relativo processo di review.
3. Adapter LinkedIn e relativi scope.
4. Worker BullMQ idempotente con retry e dead-letter handling.
5. Approval workflow, media upload e calendario interattivo.
6. Server MCP che invochi gli stessi servizi applicativi, senza bypassare autorizzazioni e audit.

"# socialtool" 
