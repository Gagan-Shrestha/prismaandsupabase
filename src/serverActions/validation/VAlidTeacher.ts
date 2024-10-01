/** @format */

"use server";

import { authOptions } from "@/lib/auth/auth.config";
import { getServerSession } from "next-auth";

export async function isValidTeacher() {
  const session = await getServerSession(authOptions);
  console.log("dd", session);
  const userRole = session?.user?.role;

  // Check if user is authorized to perform the action
  if (userRole !== "Teacher") {
    throw new Error(
      "Unauthorized access: User does not have asset Manager privileges."
    );
  } else {
    return { success: "Valid user", data: session?.user.email };
  }
}
