import type { SocialPlatform } from "@prisma/client";
export type ProviderConnection = { providerAccountId:string; displayName:string; platform:SocialPlatform };
export type PublishInput = { text:string; idempotencyKey:string; scheduledAt?:Date };
export type PublishResult = { externalPostId:string; publishedAt:Date };
export type Metric = { key:string; value:number; measuredAt:Date };
export interface SocialProvider {
  readonly platform: SocialPlatform;
  connect(input:{ workspaceId:string }):Promise<ProviderConnection>;
  publish(input:PublishInput):Promise<PublishResult>;
  getMetrics(externalPostId:string):Promise<Metric[]>;
}

