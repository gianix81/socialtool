import { redirect } from "next/navigation";
import { db } from "@/modules/shared/db";

export async function requireUser() {
  // Intentionally isolated development-only identity until a real OAuth provider is configured.
  if (process.env.NODE_ENV !== "production" && process.env.ENABLE_DEV_AUTH === "true") {
    return db.user.upsert({ where: { email: "demo@socialhub.local" }, update: {}, create: { email: "demo@socialhub.local", name: "Demo User" } });
  }
  redirect("/?auth=required");
}

