import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// The constructor does not connect. This valid fallback only allows Next.js to
// inspect route modules at build time; runtime queries still fail closed until
// the deployment supplies a real DATABASE_URL.
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://unconfigured:unconfigured@127.0.0.1:5432/unconfigured";

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({ datasources: { db: { url: databaseUrl } } });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
