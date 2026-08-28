import type { SocialPlatform } from "@prisma/client";

/**
 * SocialProvider is the platform-agnostic contract that every social
 * integration (Meta, TikTok, LinkedIn, ...) must implement. It intentionally
 * knows nothing about Prisma models or HTTP frameworks: it only deals with
 * plain data structures so it can be reused by web server actions today and
 * by an MCP server in the future.
 *
 * See docs/social-provider-contract.md for the full contract description.
 */

export interface ProviderAccountInfo {
  /** Identifier of the account on the external platform. */
  externalId: string;
  /** Human readable name shown in the UI. */
  displayName: string;
}

export interface ProviderConnectResult {
  account: ProviderAccountInfo;
  /**
   * Opaque credential payload as returned by the provider. Callers MUST
   * encrypt this before persisting it (see SocialCredential model) and
   * MUST NOT log it.
   */
  rawCredential: Record<string, unknown>;
}

export interface ProviderPublishInput {
  externalAccountId: string;
  text: string;
  mediaUrls?: string[];
}

export interface ProviderPublishResult {
  externalPostId: string;
  publishedAt: string; // ISO 8601 UTC
}

export interface ProviderMetricSnapshot {
  capturedAt: string; // ISO 8601 UTC
  metrics: Record<string, number>;
}

export interface SocialProvider {
  readonly platform: SocialPlatform;

  /**
   * Simulates/executes the OAuth or API-key based connection flow and
   * returns the account info plus a raw credential payload to be encrypted
   * and stored by the caller.
   */
  connect(input: { workspaceId: string }): Promise<ProviderConnectResult>;

  /**
   * Publishes a piece of content to the given external account.
   */
  publish(input: ProviderPublishInput): Promise<ProviderPublishResult>;

  /**
   * Retrieves the latest metric snapshot for a previously published post.
   */
  fetchMetrics(input: { externalPostId: string }): Promise<ProviderMetricSnapshot>;
}
