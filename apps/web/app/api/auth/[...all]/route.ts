import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@workspace/shared/auth/server";

export const { POST, GET } = toNextJsHandler(auth);
