import express, { Request, Response } from "express";
import prisma from "@repo/db";
import { auth } from "@repo/shared/server";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3004",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.all("/api/auth/*", toNodeHandler(auth));

app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "OK!" });
});

app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json({ message: "fetched user successfully!", data: users });
});

app.listen(5001, () => {
  console.log("app is listening on port 5001");
});
