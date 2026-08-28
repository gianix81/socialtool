# Contratto SocialProvider

Ogni adapter implementa `platform`, `connect`, `publish` e `getMetrics`. Il dominio usa DTO neutrali e non dipende dagli SDK delle piattaforme.

- `connect` completa un flusso già autorizzato e restituisce identificativo remoto, nome e piattaforma. I token non fanno parte del risultato pubblico.
- `publish` riceve testo, pianificazione opzionale e `idempotencyKey`; restituisce ID remoto e timestamp.
- `getMetrics` restituisce metriche estensibili (`key`, valore, istante).

Un adapter reale dovrà documentare scope, limiti, retry, error mapping, refresh/revoca credenziali, webhook e idempotenza. I segreti vanno ottenuti server-side dal vault, mai restituiti al browser o scritti nei log. Contract test comuni dovranno essere eseguiti contro ogni adapter. Le directory `meta`, `tiktok` e `linkedin` sono intenzionalmente prive di implementazione finché requisiti e documentazione ufficiale non saranno approvati.

