import prisma from "@workspace/db";
import axios from "axios";
import { getInstallationAccessToken } from "./get-access-token";

export async function getInstallationRepositories(workspaceId: string) {
  const integration = await prisma.gitHubIntegration.findUnique({
    where: { workspaceId },
  });

  if (!integration) {
    throw new Error("No GitHub integration found for workspace.");
  }

  const expiresAt = new Date(integration.accessTokenExpiresAt).getTime();
  const now = Date.now();

  const isExpiringSoon = expiresAt - now < 5 * 60 * 1000;

  if (isExpiringSoon) {
    console.log("Token near expiry → Refreshing before request...");

    const newToken = await getInstallationAccessToken(
      Number(integration.installationId),
    );

    await prisma.gitHubIntegration.update({
      where: { workspaceId },
      data: {
        accessToken: newToken.token,
        accessTokenExpiresAt: newToken.expiresAt,
      },
    });

    integration.accessToken = newToken.token;
  }

  const makeRequest = async (token: string) => {
    return axios.get("https://api.github.com/installation/repositories", {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github+json",
      },
    });
  };

  try {
    const { data } = await makeRequest(integration.accessToken);
    return data.repositories;
  } catch (err: any) {
    if (err.response?.status === 401) {
      console.log("Token expired → Regenerating new installation token...");

      const newToken = await getInstallationAccessToken(
        Number(integration.installationId),
      );

      await prisma.gitHubIntegration.update({
        where: { workspaceId },
        data: {
          accessToken: newToken.token,
          accessTokenExpiresAt: newToken.expiresAt,
        },
      });

      const { data } = await makeRequest(newToken.token);
      return data.repositories;
    }

    throw err;
  }
}
