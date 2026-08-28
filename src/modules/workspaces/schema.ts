import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Il nome deve avere almeno 2 caratteri.")
    .max(80, "Il nome è troppo lungo."),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;

export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || "workspace"
  );
}
