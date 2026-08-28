import { Prisma } from "@prisma/client";
import { db } from "@/modules/shared/db";

export interface WriteAuditLogInput {
  workspaceId: string;
  actorUserId: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Persists an audit log entry. Must be called for every sensitive action:
 * workspace creation/membership changes, social account connect/disconnect,
 * draft creation, publication triggering, etc. Never include raw secrets in
 * `metadata`.
 */
export async function writeAuditLog(input: WriteAuditLogInput): Promise<void> {
  await db.auditLog.create({
    data: {
      workspaceId: input.workspaceId,
      actorId: input.actorUserId,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId ?? null,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
    },
  });
}

export async function listAuditLogs(workspaceId: string, limit = 50) {
  return db.auditLog.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { actor: { select: { email: true, name: true } } },
  });
}
