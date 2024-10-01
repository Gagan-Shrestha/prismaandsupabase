/** @format */

"use server";

import { getServerSession } from "next-auth";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import DOMPurify from "isomorphic-dompurify";
import prisma from "@/lib/prisma";

interface RegisterSchema {
  adminEmail: string;
  adminPassword: string;
  name: string;
  role: string;
  adminPhone: string;
}

export const registerAdmin = async (registerDetail: string) => {
  try {
    if (!registerDetail) {
      return { error: "Missing required fields" };
    }

    const { adminEmail, adminPassword, name, adminPhone, role } =
      JSON.parse(registerDetail);
    // Sanitize input data
    const sanitizedAdminEmail = DOMPurify.sanitize(adminEmail);
    const sanitizedAdminPassword = DOMPurify.sanitize(adminPassword);
    const sanitizedName = DOMPurify.sanitize(name);
    const sanitizedAdminPhone = DOMPurify.sanitize(adminPhone);

    console.log("adminEmail", sanitizedAdminEmail);

    // Check for existing user based on the role

    const existingUser = await prisma.auth.findFirst({
      where: {
        userInEmail: sanitizedAdminEmail.toLowerCase(),
        role: "Admin",
      },
    });

    if (existingUser) {
      return { error: "User already exists" };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(sanitizedAdminPassword, 12);
    console.log("hashed", hashedPassword);

    // Create the new user
    const adminAuth = await prisma.auth.create({
      data: {
        userInEmail: sanitizedAdminEmail.toLowerCase(),
        userInPassword: hashedPassword,
        userInPhone: sanitizedAdminPhone,
        userInName: sanitizedName,
        userIsApproved: true,
        userIsVerify: true,
        role: "Admin",
      },
    });

    if (!adminAuth) {
      return { error: "Could not create user" };
    } else {
      return {
        success: "User created successfully",
      };
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Failed to create user" };
  }
};
export const verifyUser = async (token: string) => {
  // const session = await getServerSession(authOptions);
  // console.log(session?.user?.role);
  //console.log(token);
  if (!token) return { error: "Something went wrong" };

  try {
    const decodedToken = decodeToken(token);

    if (decodedToken !== null && decodedToken.email) {
      const email = decodedToken?.email;
      const result = await prisma.$transaction(
        async (prisma) => {
          const existingUser = await prisma.auth.findFirst({
            where: {
              userInEmail: email.toLowerCase(),
            },
          });

          if (!existingUser) {
            throw new Error("Failed to find user");
          }

          if (existingUser.validEmail) {
            return {
              success:
                "User is already verified. Please contact admin for secondary verification.",
            };
          } else {
            const updatedUser = await prisma.auth.update({
              where: {
                userInId: existingUser.userInId,
              },
              data: {
                validEmail: true,
              },
            });
            if (updatedUser) {
              return {
                success:
                  "Primary email verficiation successful. Secondary verification will be done by office",
              };
            } else {
              return { error: "Failed to verify email" };
            }
          }
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 10000, // default: 5000
        }
      );

      if (result) {
        return { success: result.success };
      } else {
        return { error: "Unable to verfiy" };
      }
    } else {
      return { error: "Invalid Token" };
    }
  } catch (error: any) {
    return { error: "Unable to decode token" + error };
  }
};
const decodeToken = (token: string): { email?: string } | null => {
  const secretKey = process.env.SECRET || "";

  try {
    const decodedToken = jwt.verify(token, secretKey) as { email?: string };
    //console.log("decoded", decodeToken);
    return decodedToken;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
