import { WorkspaceRole } from "@prisma/client";
import { db } from "@/modules/shared/db";
export async function requireWorkspaceAccess(userId: string, workspaceId: string, roles?: WorkspaceRole[]) {
  const membership = await db.workspaceMember.findUnique({ where: { userId_workspaceId: { userId, workspaceId } }, include: { workspace: true } });
  if (!membership || (roles && !roles.includes(membership.role))) throw new Error("Accesso al workspace negato");
  return membership;
}

