import express, { Request, Response, Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import env from "@workspace/shared/env";
import { resolve } from "path";
import { auth } from "@workspace/shared/auth/server";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import authMiddleware from "./middlewares/auth.middleware";
import prisma from "@workspace/db";
import cookieParser from "cookie-parser";
import simpleGit from "simple-git";
import projectsRoute from "./routes/project.routes";

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
  })
);

console.log("Starting backend service...");

const v1Route = Router();

app.use("/api/v1", v1Route);
v1Route.use("/projects", projectsRoute);

app.get("/", (req, res) => {
  res.status(200).send({
    service: "backend-service",
    status: "ok",
    env: process.env.NODE_ENV!,
  });
});

// app.get("/api/me", authMiddleware, async (req: Request, res) => {
//   console.log("req.user", JSON.stringify(req.user));
//   return res.status(200).json(req.user);
// });

v1Route.get("/me/", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

v1Route.post(
  "/workspace/",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { name, slug } = req.body;

      const existingSlug = await prisma.workspace.findUnique({
        where: {
          slug: slug,
        },
      });

      if (existingSlug) {
        res.status(422).json("Workspace slug already in use!");
        return;
      }

      const workspace = await prisma.workspace.create({
        data: {
          name: name,
          slug: slug,
          userId: req.user.id,
        },
      });

      res.status(201).json(workspace);
      return;
    } catch (error) {
      console.log("error creating workspace\n", error);
      return;
    }
  }
);

v1Route.post("/deploy", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { githubUrl } = req.body;

    console.log("github", githubUrl);
    const id = Math.random();
    const code = await simpleGit().clone(githubUrl, `outputs/${id}`);
    console.log("code", code);

    res.status(200).json(code);

    return;
  } catch (error) {
    console.log("error deploy the application\n", error);
    return;
  }
});

const PORT = env.BACKEND_PORT || 7000;
console.log(`Using port: ${PORT}`, process.env.NODE_ENV!);

app.listen(PORT, () => {
  console.log(`Backend service is running on port ${PORT}`);
});
