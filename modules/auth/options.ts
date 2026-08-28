import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/modules/shared/db";

const providers: NextAuthOptions["providers"] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: false,
    }),
  );
}

if (process.env.NODE_ENV !== "production" && process.env.ENABLE_DEV_AUTH === "true") {
  providers.push(
    CredentialsProvider({
      name: "Development demo",
      credentials: {},
      async authorize() {
        return db.user.upsert({
          where: { email: "demo@socialhub.local" },
          update: {},
          create: { email: "demo@socialhub.local", name: "Demo User" },
        });
      },
    }),
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "database" },
  providers,
  pages: { signIn: "/" },
  secret: process.env.AUTH_SECRET,
};
