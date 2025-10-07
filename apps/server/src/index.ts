import express, { Request, Response } from "express";
import prisma from "@repo/db";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cors from "cors";
import { auth } from "@repo/shared/server";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: true,
    // origin: "http://localhost:3004",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "OK!", env: process.env.NODE_ENV });
});

app.get("/api/me", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get session" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res
      .status(200)
      .json({ message: "Fetched users successfully!", data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(5001, () => {
  console.log("app is listening on port 5001");
});
