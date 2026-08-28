# Architettura

SocialHub è un monolite modulare Next.js. Le pagine rendono l'interfaccia, le Server Actions costituiscono il boundary web, i servizi applicativi applicano autorizzazioni e regole, Prisma persiste su PostgreSQL. Redis e BullMQ sono predisposti per separare in seguito scheduling e pubblicazione dal processo web.

## Flussi principali

**Connessione mock:** Server Action → membership/ruolo → `SocialProvider.connect` → upsert tenant-scoped → audit.

**Bozza:** input → Zod → membership/ruolo → insert con `workspaceId` → audit.

**Pubblicazione immediata:** conferma esplicita → autorizzazione → bozza filtrata per `id + workspaceId` → provider → target → stato finale → audit. Il futuro worker chiamerà lo stesso servizio applicativo e userà una chiave di idempotenza per destinazione.

## Decisioni

- UUID e timestamp gestiti da PostgreSQL/Prisma; date interpretate e mostrate in UTC/local timezone solo ai bordi.
- Varianti piattaforma conservate inizialmente come JSON per evitare una gerarchia prematura; potranno diventare una tabella se acquisiscono lifecycle proprio.
- Metriche normalizzate come coppie `metricKey/value` con dimensioni JSON e serie temporale.
- Adapter Meta, TikTok e LinkedIn sono solo namespace: nessun endpoint o comportamento è inventato.
- Il futuro MCP sarà un adapter in ingresso parallelo al web e richiamerà i servizi esistenti.

