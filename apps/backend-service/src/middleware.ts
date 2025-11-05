import { auth } from "@workspace/shared/auth/server";
import { fromNodeHeaders } from "better-auth/node";
import { NextFunction, Request, Response } from "express";

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
      query: { disableCookieCache: true },
    });

    console.log("session", session);
    console.log("req.headers.cookie:", req.headers);

    if (!session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = session.user;
    req.session = session;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
