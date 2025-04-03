import { AuthSession, AuthUser, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db, withDb } from "../db";
import { users } from "@praxisnotes/database";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await withDb(async () => {
          const [foundUser] = await db
            .select({
              id: users.id,
              email: users.email,
              fullName: users.fullName,
              firstName: users.firstName,
              lastName: users.lastName,
              avatarUrl: users.avatarUrl,
              passwordHash: users.passwordHash,
              organizationId: users.organizationId,
            })
            .from(users)
            .where(eq(users.email, credentials.email.toLowerCase()))
            .limit(1);
          return foundUser;
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.passwordHash,
        );

        if (!isPasswordValid) {
          return null;
        }

        const authUser: AuthUser = {
          id: user.id,
          email: user.email,
          name: user.fullName || `${user.firstName} ${user.lastName}`.trim(),
          image: user.avatarUrl,
        };

        if (user.organizationId) {
          authUser.organizationId = user.organizationId;
        }

        console.log("authUser", authUser);

        return authUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;

        const authUser = user as AuthUser;
        if (authUser.organizationId) {
          token.organizationId = authUser.organizationId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      const sessionUser = {
        ...session.user,
        id: token.id as string,
      } as AuthSession["user"];

      if (token.organizationId) {
        sessionUser.organizationId = token.organizationId;
      }

      sessionUser.isDefaultOrg = false;

      return {
        ...session,
        user: sessionUser,
      } as AuthSession;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
};
