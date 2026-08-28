"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SocialPlatform, WorkspaceRole } from "@prisma/client";
import { requireUser } from "@/modules/auth/session";
import { db } from "@/modules/shared/db";
import { draftSchema,workspaceSchema } from "@/modules/content/schemas";
import { requireWorkspaceAccess } from "@/modules/workspaces/access";
import { MockSocialProvider } from "@/modules/social-accounts/providers/mock";
import { recordAudit } from "@/modules/audit/service";
import { publishNow } from "@/modules/publishing/service";
export async function createWorkspace(formData:FormData){const user=await requireUser();const {name}=workspaceSchema.parse({name:formData.get("name")});const base=name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");const workspace=await db.workspace.create({data:{name,slug:`${base}-${crypto.randomUUID().slice(0,8)}`,members:{create:{userId:user.id,role:WorkspaceRole.OWNER}}}});await recordAudit({workspaceId:workspace.id,actorId:user.id,action:"workspace.created",resourceType:"Workspace",resourceId:workspace.id});redirect(`/dashboard?workspace=${workspace.id}`)}
export async function connectSocial(formData:FormData){const user=await requireUser();const workspaceId=String(formData.get("workspaceId"));const platform=SocialPlatform[String(formData.get("platform")) as keyof typeof SocialPlatform];if(!platform)throw new Error("Piattaforma non valida");await requireWorkspaceAccess(user.id,workspaceId,[WorkspaceRole.OWNER,WorkspaceRole.ADMIN]);const connection=await new MockSocialProvider(platform).connect({workspaceId});const account=await db.socialAccount.upsert({where:{workspaceId_platform_providerAccountId:{workspaceId,platform,providerAccountId:connection.providerAccountId}},update:{active:true},create:{workspaceId,...connection}});await recordAudit({workspaceId,actorId:user.id,action:"social_account.connected",resourceType:"SocialAccount",resourceId:account.id,metadata:{platform}});revalidatePath("/social-accounts")}
export async function createDraft(formData:FormData){const user=await requireUser();const parsed=draftSchema.parse({workspaceId:formData.get("workspaceId"),body:formData.get("body"),platforms:formData.getAll("platforms"),scheduledAt:String(formData.get("scheduledAt")||"")||undefined});await requireWorkspaceAccess(user.id,parsed.workspaceId,[WorkspaceRole.OWNER,WorkspaceRole.ADMIN,WorkspaceRole.EDITOR]);const draft=await db.contentDraft.create({data:{workspaceId:parsed.workspaceId,authorId:user.id,body:parsed.body,targetPlatforms:parsed.platforms,scheduledAt:parsed.scheduledAt,status:parsed.scheduledAt?"SCHEDULED":"DRAFT"}});await recordAudit({workspaceId:parsed.workspaceId,actorId:user.id,action:"draft.created",resourceType:"ContentDraft",resourceId:draft.id});revalidatePath("/content")}
export async function publishDraft(formData:FormData){const user=await requireUser();await publishNow({userId:user.id,workspaceId:String(formData.get("workspaceId")),draftId:String(formData.get("draftId")),confirmed:formData.get("confirmed")==="yes"});revalidatePath("/content")}

