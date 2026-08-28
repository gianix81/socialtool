import { Prisma } from "@prisma/client";
import { db } from "@/modules/shared/db";
export async function recordAudit(input: { workspaceId:string; actorId:string; action:string; resourceType:string; resourceId?:string; metadata?:Prisma.InputJsonValue }) {
  return db.auditLog.create({ data: input });
}
