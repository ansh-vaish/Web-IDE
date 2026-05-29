import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { db } from "./lib/db";
import { getAccountByUserId, getUserById } from "./modules/auth/actions";

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email && account?.provider === "github") {
        return "/api/auth/error?error=NoEmail";
      }
      return true;
    },

    async jwt({ token, account, user }) {
      // OAuth login happened
      if (account && user) {
        const existingAccount = await db.account.findFirst({
          where: {
            userId: user.id,
            provider: account.provider,
          },
        });

        if (existingAccount) {
          await db.account.update({
            where: {
              id: existingAccount.id,
            },

            data: {
              access_token: account.access_token,

              expires_at: account.expires_at,

              refresh_token:
                account.refresh_token ?? existingAccount.refresh_token,
            },
          });
        }
      }

      // SESSION TOKEN ENRICHMENT

      if (!token.sub) {
        return token;
      }

      const existingUser = await getUserById(token.sub);

      if (!existingUser) {
        return token;
      }

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.image = existingUser.image;

      token.role = existingUser.role;

      return token;
    },

    async session({ session, token }) {
      // Attach the user ID from the token to the session
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.sub && session.user) {
        session.user.role = token.role;
        session.user.image = token.image as string | null | undefined;
      }

      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
