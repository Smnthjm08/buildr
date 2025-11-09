import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { connectGitHub, getGitHubRepos } from "../controllers/github.controller";

const githubRoutes = Router();

githubRoutes.post("/connect", authMiddleware, connectGitHub);
githubRoutes.get("/repos", authMiddleware, getGitHubRepos);

export default githubRoutes;
