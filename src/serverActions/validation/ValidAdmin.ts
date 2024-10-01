/** @format */

"use server";


import { authOptions } from "@/lib/auth/auth.config";
import { getServerSession } from "next-auth";

export async function isValidAdmin() {
  const session = await getServerSession(authOptions);
  console.log("dd", session);
  const userRole = session?.user?.role;

  // Check if user is authorized to perform the action
  if (userRole !== "Admin") {
    throw new Error(
      "Unauthorized access: User does not have admin privileges."
    );
  } else {
    return { success: "Valid user", data: session?.user.email };
  }
}
