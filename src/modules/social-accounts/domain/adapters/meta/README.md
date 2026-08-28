# Meta (Facebook / Instagram) adapter — future work

This folder is a placeholder for the future `MetaSocialProvider`
implementing the `SocialProvider` interface (see
`../social-provider.ts`) using the real Meta Graph API.

No implementation exists yet in this iteration: no endpoints, SDKs or
credentials are referenced here to avoid inventing an incorrect contract.

When implemented, it must:
- Implement `connect`, `publish`, and `fetchMetrics` from `SocialProvider`.
- Encrypt and store credentials via the `SocialCredential` model only.
- Be registered in `../provider-registry.ts` for `FACEBOOK` and `INSTAGRAM`.
- Never log raw tokens or API responses containing secrets.
