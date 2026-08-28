import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const client = new PrismaClient();
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

/**
 * Prisma is deliberately lazy. Next.js imports dynamic page modules while
 * collecting build metadata on Vercel; constructing the client at module scope
 * would make that build depend on runtime-only environment variables.
 */
export const db = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getPrismaClient();
    const value = Reflect.get(client, property, client) as unknown;
    return typeof value === "function" ? value.bind(client) : value;
  },
});
