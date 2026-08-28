import { PublicationStatus, WorkspaceRole } from "@prisma/client";
import { db } from "@/modules/shared/db";
import { requireWorkspaceAccess } from "@/modules/workspaces/access";
import { MockSocialProvider } from "@/modules/social-accounts/providers/mock";
import { recordAudit } from "@/modules/audit/service";
export async function publishNow(input:{userId:string;workspaceId:string;draftId:string;confirmed:boolean}) {
  if (!input.confirmed) throw new Error("La pubblicazione immediata richiede conferma esplicita");
  await requireWorkspaceAccess(input.userId,input.workspaceId,[WorkspaceRole.OWNER,WorkspaceRole.ADMIN,WorkspaceRole.EDITOR]);
  const draft=await db.contentDraft.findFirst({where:{id:input.draftId,workspaceId:input.workspaceId},include:{workspace:{include:{socialAccounts:true}}}});
  if (!draft) throw new Error("Bozza non trovata");
  const accounts=draft.workspace.socialAccounts.filter(a=>draft.targetPlatforms.includes(a.platform));
  if (!accounts.length) throw new Error("Collega almeno un account di destinazione");
  const publication=await db.publication.create({data:{workspaceId:input.workspaceId,draftId:draft.id,status:PublicationStatus.PUBLISHING}});
  for (const account of accounts) {
    const result=await new MockSocialProvider(account.platform).publish({text:draft.body,idempotencyKey:`${publication.id}-${account.id}`});
    await db.publicationTarget.create({data:{publicationId:publication.id,socialAccountId:account.id,platform:account.platform,status:PublicationStatus.PUBLISHED,externalPostId:result.externalPostId}});
  }
  await db.$transaction([db.publication.update({where:{id:publication.id},data:{status:PublicationStatus.PUBLISHED,publishedAt:new Date()}}),db.contentDraft.update({where:{id:draft.id},data:{status:"PUBLISHED"}})]);
  await recordAudit({workspaceId:input.workspaceId,actorId:input.userId,action:"publication.published",resourceType:"Publication",resourceId:publication.id});
  return publication;
}

