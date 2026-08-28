import type { SocialPlatform } from "@prisma/client";
import type { SocialProvider } from "../domain/social-provider";
export class MockSocialProvider implements SocialProvider {
  constructor(readonly platform:SocialPlatform) {}
  async connect({workspaceId}:{workspaceId:string}) { return { platform:this.platform, providerAccountId:`mock-${workspaceId}-${this.platform.toLowerCase()}`, displayName:`${this.platform} Demo` }; }
  async publish(input:{text:string;idempotencyKey:string}) { if (!input.text.trim()) throw new Error("Contenuto vuoto"); return { externalPostId:`mock-post-${input.idempotencyKey}`, publishedAt:new Date() }; }
  async getMetrics(_externalPostId:string) { const now=new Date(); return [{key:"impressions",value:1240,measuredAt:now},{key:"engagements",value:87,measuredAt:now}]; }
}

