import type { SocialPlatform } from "@prisma/client";
import type {
  ProviderConnectResult,
  ProviderMetricSnapshot,
  ProviderPublishInput,
  ProviderPublishResult,
  SocialProvider,
} from "./social-provider";

/**
 * MockSocialProvider simulates a full connect -> publish -> metrics
 * lifecycle without ever calling an external API. It is used for every
 * platform in this iteration so the product can be demoed and tested
 * end-to-end before real integrations exist.
 */
export class MockSocialProvider implements SocialProvider {
  constructor(public readonly platform: SocialPlatform) {}

  async connect(input: { workspaceId: string }): Promise<ProviderConnectResult> {
    const externalId = `mock_${this.platform.toLowerCase()}_${input.workspaceId.slice(0, 8)}`;
    return {
      account: {
        externalId,
        displayName: `${capitalize(this.platform)} Demo Account`,
      },
      rawCredential: {
        accessToken: `mock-token-${cryptoRandom()}`,
        tokenType: "mock",
        issuedAt: new Date().toISOString(),
      },
    };
  }

  async publish(input: ProviderPublishInput): Promise<ProviderPublishResult> {
    return {
      externalPostId: `mockpost_${cryptoRandom()}`,
      publishedAt: new Date().toISOString(),
    };
  }

  async fetchMetrics(_input: { externalPostId: string }): Promise<ProviderMetricSnapshot> {
    // Deterministic-ish pseudo-random mock metrics for demo purposes.
    const impressions = 200 + Math.floor(Math.random() * 800);
    const likes = Math.floor(impressions * (0.02 + Math.random() * 0.05));
    const comments = Math.floor(likes * 0.1);
    const shares = Math.floor(likes * 0.05);

    return {
      capturedAt: new Date().toISOString(),
      metrics: { impressions, likes, comments, shares },
    };
  }
}

function capitalize(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function cryptoRandom(): string {
  return Math.random().toString(36).slice(2, 10);
}
