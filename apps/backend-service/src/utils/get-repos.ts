import axios from "axios";

export async function getInstallationRepositories(accessToken: string) {
  const { data } = await axios.get(
    "https://api.github.com/installation/repositories",
    {
      headers: {
        Authorization: `token ${accessToken}`, // Note: NOT Bearer
        Accept: "application/vnd.github+json",
      },
    }
  );

  return data.repositories; // returns list of repos
}
