import { describe,expect,it } from "vitest";
import { SocialPlatform } from "@prisma/client";
import { MockSocialProvider } from "./mock";
describe("MockSocialProvider",()=>{it("connette e pubblica deterministicamente",async()=>{const provider=new MockSocialProvider(SocialPlatform.INSTAGRAM);const account=await provider.connect({workspaceId:"workspace"});expect(account.platform).toBe("INSTAGRAM");const result=await provider.publish({text:"Ciao",idempotencyKey:"key-1"});expect(result.externalPostId).toBe("mock-post-key-1");});it("rifiuta contenuti vuoti",async()=>{await expect(new MockSocialProvider(SocialPlatform.FACEBOOK).publish({text:" ",idempotencyKey:"x"})).rejects.toThrow("vuoto")})});

