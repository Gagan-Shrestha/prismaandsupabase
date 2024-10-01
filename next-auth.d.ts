/** @format */

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      email?: string;
      phone?: string;
      name?: string;
      image?: string;
      role?: string;
      isVerified?: boolean;
    } & DefaultSession;
  }
  interface User extends DefaultUser {
    email?: string | null;
    name?: string | null;
    phone?: string | null;
    password: string;
    role: string | null;
    userId?: string;
    isVerified?: boolean;
    isRejected?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: string;
    id?: string;
    isVerified?: boolean;
  }
}
