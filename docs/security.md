# Sicurezza

## Minacce e controlli

- **Accesso cross-tenant:** membership verificata server-side e query vincolate a `workspaceId`; indici composti supportano il pattern.
- **Escalation di privilegi:** mutazioni autorizzate per ruolo; VIEWER non modifica, EDITOR non collega account.
- **Furto token:** nessun token nel client o nei log; `SocialCredential` accetta solo payload cifrato o riferimento a secret manager. Chiavi di cifratura esterne al database.
- **Input malevolo:** Zod valida e normalizza ai boundary server; React esegue escaping del testo. Futuri URL/media richiederanno allowlist e scansione.
- **Replay/doppia pubblicazione:** chiavi di idempotenza per target; il worker futuro userà lock e transizioni atomiche.
- **CSRF/sessione:** mutazioni tramite Server Actions/Auth.js; cookie sicuri in produzione.

## Conferme e audit

Pubblicazione immediata, revoca account, eliminazione contenuti e modifiche ai ruoli richiedono conferma esplicita. Connessioni, bozze e pubblicazioni registrano attore, workspace, tipo/ID risorsa e timestamp. Metadata e messaggi d'errore non devono contenere token.

Prima della produzione servono provider Auth.js reale, secret manager/KMS, rate limiting, CSP, retention audit, backup/restore testato, monitoraggio e test automatici di isolamento tenant.
