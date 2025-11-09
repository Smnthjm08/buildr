import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  repoUrl: z
    .string()
    .url("Invalid repository URL")
    .optional(),
  framework: z.enum(["HTML", "REACT", "NEXTJS"]).optional(),
  outputDir: z.string().default("dist"),
  buildCommand: z.string().default("npm run build")
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
