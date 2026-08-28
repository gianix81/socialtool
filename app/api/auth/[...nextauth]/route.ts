import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

async function handler(request: NextRequest) {
  // Keep Prisma/Auth.js out of Next's build-time route evaluation. The
  // production database is required when the endpoint is actually invoked.
  const [{ default: NextAuth }, { authOptions }] = await Promise.all([
    import("next-auth"),
    import("@/modules/auth/options"),
  ]);

  return NextAuth(authOptions)(request);
}

export { handler as GET, handler as POST };
