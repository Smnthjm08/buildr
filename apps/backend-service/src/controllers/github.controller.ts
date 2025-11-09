import { Request, Response } from "express";
import prisma from "@workspace/db";
import { getInstallationAccessToken } from "../utils/get-access-token";
import { getInstallationRepositories } from "../utils/get-repos";

export const connectGitHub = async (req: Request, res: Response) => {
  try {
    const { installationId } = req.body;
    const workspaceId = req.workspace?.id;

    if (!installationId) {
      return res.status(400).json({ error: "installationId is required" });
    }

    if (!workspaceId) {
      return res.status(400).json({ error: "Workspace not found" });
    }

    const tokenData = await getInstallationAccessToken(Number(installationId));

    const existing = await prisma.gitHubIntegration.findUnique({
      where: { workspaceId },
    });

    if (existing) {
      await prisma.gitHubIntegration.update({
        where: { workspaceId },
        data: {
          installationId: installationId.toString(),
          accessToken: tokenData.token,
          accessTokenExpiresAt: tokenData.expiresAt,
        },
      });
    } else {
      await prisma.gitHubIntegration.create({
        data: {
          installationId: installationId.toString(),
          accessToken: tokenData.token,
          accessTokenExpiresAt: tokenData.expiresAt,
          workspaceId,
        },
      });
    }

    return res.status(200).json({ message: "GitHub connected successfully" });
  } catch (error) {
    console.error("GitHub Connect Error:", error);
    return res.status(500).json({ error: "Failed to connect GitHub" });
  }
};

export const getGitHubRepos = async (req: Request, res: Response) => {
  try {
    const workspaceId = req.workspace?.id;

    if (!workspaceId) {
      return res.status(400).json({ error: "Workspace not found" });
    }

    const integration = await prisma.gitHubIntegration.findUnique({
      where: { workspaceId },
    });

    if (!integration) {
      return res.status(400).json({ error: "GitHub not connected" });
    }

    const repositories = await getInstallationRepositories(
      integration.accessToken,
    );

    return res.status(200).json({ repositories });
  } catch (error) {
    console.error("GitHub Fetch Repos Error:", error);
    return res.status(500).json({ error: "Failed to fetch repositories" });
  }
};
