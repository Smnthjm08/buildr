import axios from "axios";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

export async function getInstallationAccessToken(installationId: number) {
  const privateKey = fs.readFileSync(
    path.join(process.cwd(), "buildrr-dev.private-key.pem"),
    "utf8",
  );

  const appJwt = jwt.sign(
    {
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 600,
      iss: Number(process.env.GITHUB_APPS_APP_ID),
    },
    privateKey,
    { algorithm: "RS256" },
  );

  const { data } = await axios.post(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {},
    {
      headers: {
        Authorization: `Bearer ${appJwt}`,
        Accept: "application/vnd.github+json",
      },
    },
  );

  return {
    token: data.token,
    expiresAt: data.expires_at, // ISO timestamp
  };
}
