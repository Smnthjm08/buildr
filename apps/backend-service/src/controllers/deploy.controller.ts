import prisma from "@workspace/db";
import { createProjectSchema } from "@workspace/shared/schema/projects";
import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { simpleGit } from "simple-git";
import { lookup as mimeLookup } from "mime-types";
import { uploadToS3 } from "../lib/s3-upload";
import { getAllFiles } from "../lib/get-files";

import env from "@workspace/shared/env";
import { publisher } from "..";

const { AWS_S3_REGION, AWS_S3_BUCKET_NAME } = env;

export function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const createProjectAndFirstDeployment = async (
  req: Request,
  res: Response,
) => {
  try {
    const parsed = createProjectSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parsed.error.flatten(),
      });
    }

    const { name, repoUrl, framework, outputDir, buildCommand } = parsed.data;

    const workspaceId = req.workspace?.id;

    if (!workspaceId) {
      return res
        .status(403)
        .json({ error: "Workspace not found or unauthorized." });
    }

    const baseSlug = slugify(name);
    let slug = baseSlug;
    let count = 1;

    while (await prisma.project.findFirst({ where: { slug, workspaceId } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const [project, deployment] = await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name,
          slug,
          repoUrl,
          framework,
          outputDir,
          buildCommand,
          workspaceId,
        },
      });

      const deployment = await tx.deployment.create({
        data: {
          projectId: project.id,
          status: "queued",
          url: "",
        },
      });

      return [project, deployment];
    });

    if (!project.repoUrl) {
      return res.status(400).json({ error: "Repository URL is required" });
    }

    const git = simpleGit();
    const clonePath = path.join(__dirname, `../../outputs/${deployment.id}`);
    console.log("🚀 Cloning repository...");
    await git.clone(project.repoUrl, clonePath);
    console.log("ccloned to:", clonePath);

    const allFiles = getAllFiles(clonePath);
    const s3Prefix = `${deployment.id}`;

    console.log(`Found ${allFiles.length} files to upload...`);

    const uploadPromises = allFiles.map(async (filePath) => {
      const relativePath = path
        .relative(clonePath, filePath)
        .replace(/\\/g, "/");
      const contentType = mimeLookup(filePath) || "application/octet-stream";
      const fileBuffer = fs.readFileSync(filePath);
      const s3Key = `${s3Prefix}/${relativePath}`;

      console.log(`⬆️ Uploading: ${relativePath}`);
      await uploadToS3(s3Key, fileBuffer, contentType as string);
    });

    await Promise.all(uploadPromises);

    const deployedUrl = `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_S3_REGION}.amazonaws.com/${s3Prefix}/index.html`;

    const updatedDeployment = await prisma.deployment.update({
      where: { id: deployment.id },
      data: {
        status: "uploaded",
        url: deployedUrl,
        logs: "Upload completed successfully",
      },
    });

    console.log("uploaded successfully to S3!");

    await publisher.lPush("deployment-id", updatedDeployment.id);
    await publisher.hSet("status", updatedDeployment.id, "uploaded");

    return res.status(201).json({
      message: "Project created and uploaded successfully",
      project,
      deployment: updatedDeployment,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ message: "Failed to create project", error });
  }
};
