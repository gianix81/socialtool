import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seeds a minimal development dataset: one user, one workspace, one
 * membership. Intended for local development only.
 */
async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@socialhub.local" },
    update: {},
    create: {
      email: "demo@socialhub.local",
      name: "Demo User",
    },
  });

  const workspace = await prisma.workspace.upsert({
    where: { slug: "demo-workspace" },
    update: {},
    create: {
      name: "Demo Workspace",
      slug: "demo-workspace",
    },
  });

  await prisma.workspaceMember.upsert({
    where: { userId_workspaceId: { workspaceId: workspace.id, userId: user.id } },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: user.id,
      role: "OWNER",
    },
  });

  // eslint-disable-next-line no-console
  console.log("Seed completed:", { user: user.email, workspace: workspace.slug });
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
