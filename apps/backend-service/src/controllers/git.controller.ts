import { Request, Response } from "express";
import simpleGit from "simple-git";

export const getRepoInfo = async (req: Request, res: Response) => {
  try {
    const { githubUrl } = req.body;

    if (!githubUrl) {
      return res.status(400).json({ error: "Repo url is required" });
    }

    const git = simpleGit();

    const test = await git.fetch(githubUrl)

    const status = await git.status();
    const remotes = await git.getRemotes(true);

    return res.status(200).json({
      message: "Fetched repo info successfully",
      test,
    });
  } catch (error: any) {
    console.error("Error fetching repo info:", error);
    return res.status(500).json({ error: error.message });
  }
};
