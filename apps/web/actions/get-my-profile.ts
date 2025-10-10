"use server";

import prisma from "@repo/db";
import { getSession } from "./get-session";

export default async function getMyProfile() {
  try {
    const session = await getSession();

    if (!session?.user) {
      return { status: "error", message: "User not authenticated." };
    }

    const userProfile = await prisma.user.findUnique({
      where: { id: session?.user?.id },
      include: { userDetails: true }
    });
    console.log("userProfile", userProfile);
    return {success: true, message: null, data: userProfile}
  } catch (error) {
    console.log("error getting the user profile", error);
    return { success: false, message: "Error fetching user profile!" };
  }
}
