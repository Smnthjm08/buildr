import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@repo/shared/server";

export const { POST, GET } = toNextJsHandler(auth);
