import express, { Request, Response, Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import env from "@workspace/shared/env";
import { resolve } from "path";
import { auth } from "@workspace/shared/auth/server";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import projectsRoutes from "./routes/project.routes";
import workspaceRoutes from "./routes/workspace.routes";
import gitRoutes from "./routes/git.routes";
import githubRoutes from "./routes/github.routes";

dotenv.config({ path: resolve(__dirname, "../../../.env") });

const app = express();

app.all("/api/auth/{any}", toNodeHandler(auth));

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  }),
);

console.log("Starting backend service...");

app.get("/", (_req: Request, res:Response) => {
  res.status(200).send({
    service: "backend-service",
    status: "ok",
    env: process.env.NODE_ENV!,
  });
});

const v1Route = Router();

app.use("/api/v1", v1Route);
v1Route.use("/project", projectsRoutes);
v1Route.use("/workspace", workspaceRoutes);
v1Route.use("/git", gitRoutes);
v1Route.use("/github", githubRoutes);

v1Route.get("/me/", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});


const PORT = env.BACKEND_PORT || 7000;
console.log(`Using port: ${PORT}`, process.env.NODE_ENV!);

app.listen(PORT, () => {
  console.log(`Backend service is running on port ${PORT}`);
});
