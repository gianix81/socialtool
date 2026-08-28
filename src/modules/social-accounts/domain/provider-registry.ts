import type { SocialPlatform } from "@prisma/client";
import { ALL_PLATFORMS } from "@/src/modules/shared/platform";
import { MockSocialProvider } from "./mock-social-provider";
import type { SocialProvider } from "./social-provider";

/**
 * Central registry mapping a platform to its SocialProvider implementation.
 * Today every platform resolves to MockSocialProvider. Future adapters
 * (Meta, TikTok, LinkedIn) will be registered here once implemented, without
 * changing any calling code in the application/domain layer.
 *
 * See:
 *  - src/modules/social-accounts/domain/adapters/meta (future)
 *  - src/modules/social-accounts/domain/adapters/tiktok (future)
 *  - src/modules/social-accounts/domain/adapters/linkedin (future)
 */
const registry = new Map<SocialPlatform, SocialProvider>(
  ALL_PLATFORMS.map((platform) => [platform, new MockSocialProvider(platform)]),
);

export function getSocialProvider(platform: SocialPlatform): SocialProvider {
  const provider = registry.get(platform);
  if (!provider) {
    throw new Error(`No SocialProvider registered for platform ${platform}`);
  }
  return provider;
}
