import axios from "axios";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

export async function getInstallationAccessToken(installationId: number) {
  const privateKey = fs.readFileSync(
    path.join(process.cwd(), "buildrr-dev.private-key.pem"),
    "utf8"
  );

  // Create the JWT for GitHub App authentication
  const appJwt = jwt.sign(
    {
      iat: Math.floor(Date.now() / 1000),          // Issued at
      exp: Math.floor(Date.now() / 1000) + 600,    // Expires in 10 minutes
        iss: Number(process.env.GITHUB_APPS_APP_ID),
    },
    privateKey,
    { algorithm: "RS256" }
  );

  console.log('appdvfev', appJwt)

  // Exchange for installation token
  const { data } = await axios.post(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {},
    {
      headers: {
        Authorization: `Bearer ${appJwt}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  return data; // data.token is the accessToken
}
