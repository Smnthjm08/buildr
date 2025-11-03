import { auth } from "@workspace/shared/auth/server";
import { fromNodeHeaders } from "better-auth/node";
import { NextFunction, Request, Response } from "express";

export default async function authMiddleware(
  req: Request & { user?: any; session?: any },
  res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Attach user + session to request for downstream handlers
    req.user = session.user;
    req.session = session;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
