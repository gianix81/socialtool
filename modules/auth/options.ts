import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/modules/shared/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "database" },
  providers:
    process.env.NODE_ENV !== "production" && process.env.ENABLE_DEV_AUTH === "true"
      ? [CredentialsProvider({ name: "Development demo", credentials: {}, async authorize() { return db.user.upsert({ where:{email:"demo@socialhub.local"}, update:{}, create:{email:"demo@socialhub.local",name:"Demo User"} }); } })]
      : [],
  pages: { signIn: "/" },
  secret: process.env.AUTH_SECRET,
};
