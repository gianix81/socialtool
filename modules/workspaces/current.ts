import { requireUser } from "@/modules/auth/session";
import { db } from "@/modules/shared/db";
export async function getWorkspace(requested?:string){const user=await requireUser();const memberships=await db.workspaceMember.findMany({where:{userId:user.id},include:{workspace:true},orderBy:{createdAt:"asc"}});const current=memberships.find(m=>m.workspaceId===requested)?.workspace??memberships[0]?.workspace;return {user,memberships,current};}

