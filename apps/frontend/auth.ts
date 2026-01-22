import NextAuth, { DefaultSession } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type JWT } from "next-auth/jwt";

import authConfig from "./auth.config";

import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "./lib/db";
import { getUserById } from "./helpers/read-db";

declare module "next-auth" {
  interface Session {
    user: {
      isPremium: boolean;
      address: string;
      fid: number;
      role: "ADMIN" | "USER";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isPremium: boolean;
    address: string;
    fid: number;
    role: "ADMIN" | "USER";
  }
}

const isDev = process.env.NODE_ENV === "development";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    // error: isLocal ? "http://app.localhost:3000/error" : "/error",
    // signIn: isLocal ? "http://app.localhost:3000/login" : "/login",
    error: "/error",
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user || !user.id) return false;

      const existingUser = await getUserById(user.id);
      if (existingUser) {
        return true;
      } else {
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      if (session.user && token.fid) session.user.fid = token.fid;
      if (session.user && token.address) session.user.address = token.address;
      if (session.user && token.isPremium)
        session.user.isPremium = token.isPremium;
      if (session.user && token.role) session.user.role = token.role;

      return session;
    },
    async jwt({ token }) {
      if (token.sub) {
        const user = await getUserById(token.sub);

        if (user) {
          token.isPremium = user.isPremium;
          token.address = user.walletAddress;
          token.fid = user.fid;
          token.role = user.role;
        }
      }

      return token;
    },
  },

  // eslint-disable-next-line
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },

  cookies: {
    sessionToken: {
      // Let library pick the default name if you omit `name`, or set it explicitly:
      name:
        process.env.NODE_ENV === "production"
          ? "authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      },
    },
    callbackUrl: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.callback-url"
          : "authjs.callback-url",
      options: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      },
    },
    csrfToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Host-authjs.csrf-token"
          : "authjs.csrf-token",
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      },
    },
  },

  ...authConfig,
});
