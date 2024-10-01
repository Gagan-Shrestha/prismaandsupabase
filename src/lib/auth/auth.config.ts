/** @format */

import type { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { z } from "zod";

import { User } from "next-auth";
import prisma from "./prisma";


async function getUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.auth.findFirst({
    where: {
      userInEmail: email.toLowerCase(),
    },
  });

  if (user) {
    const userData: User = {
      email: user.userInEmail,
      name: user.userInName,
      password: user.userInPassword,
      role: user.role,
      id: user.userInId,
      isVerified: user.userIsVerify,
      isRejected: user.userIsRejected,
    };
    console.log("userData", userData);
    return userData;
  } else {
    return null;
  }
}

async function getUserByPhone(phone: string): Promise<User | null> {
  const user = await prisma.auth.findFirst({
    where: {
      userInPhone: phone,
    },
  });

  if (user) {
    const userData: User = {
      phone: user.userInPhone,
      name: user.userInName,
      password: user.userInPassword,
      role: user.role || "",
      id: user.userInId,
      isVerified: user.userIsVerify,
      isRejected: user.userIsRejected,
    };
    return userData;
  } else {
    return null;
  }
}

async function getUser(login: string): Promise<User | null> {
  try {
    // Check if the login is an email or phone
    const isEmail = login.includes("@");

    if (isEmail) {
      return await getUserByEmail(login);
    } else {
      return await getUserByPhone(login);
    }
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        login: { label: "Email or Phone:", type: "text" },
        password: { label: "Password:", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            login: z.string(),
            password: z.string().min(2),
          })
          .safeParse(credentials);

        // console.log("parsed", parsedCredentials);
        if (parsedCredentials.success) {
          const { login, password } = parsedCredentials.data;

          const user = await getUser(login);
          // console.log(user);
          if (!user) {
            throw new Error("User not found. Please enter valid credentials");
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            if (user.isRejected) {
              throw new Error(
                "You are not authorized to login. Please contact the admin department"
              );
            }

            return {
              ...user,

              role: user.role,
              email: user.email,
              phone: user?.phone,
              name: user.name,
              isVerified: user.isVerified,
            };
          } else {
            throw new Error("Password is incorrect");
          }
        }

        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && user.role) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.phone = user.phone;
        token.name = user.name;
        token.isVerified = user.isVerified;
      }
      // console.log("token", token);
      return token;
    },
    async session({ session, token }) {
      if (token.role && token.id) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email || "";
        session.user.phone = (token?.phone as string) || "";
        session.user.isVerified = token.isVerified;
      }
      console.log(session, "session");
      return session;
    },

    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl + "/dashboard";
    },
  },
};
