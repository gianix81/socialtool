import { SocialPlatform } from "@prisma/client";
import { z } from "zod";
export const draftSchema = z.object({ workspaceId:z.string().uuid(), body:z.string().trim().min(1).max(5000), platforms:z.array(z.nativeEnum(SocialPlatform)).min(1), scheduledAt:z.string().optional().transform(v=>v?new Date(v):undefined).refine(v=>!v || !Number.isNaN(v.valueOf()), "Data non valida") });
export const workspaceSchema = z.object({ name:z.string().trim().min(2).max(80) });

