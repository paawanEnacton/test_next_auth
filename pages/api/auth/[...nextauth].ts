import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "../../../prisma/index";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any, req: any): Promise<any> {
        // find user in your database and validate password
        const getUser: any = await prisma.users.findFirst({
          where: {
            email: credentials?.email,
          },
        });

        if (!getUser) {
          return false;
        }

        const passwordMatch = await bcrypt.compare(
          credentials?.password,
          getUser?.password
        );

        if (passwordMatch) {
          return true;
        } else {
          return false;
        }
      },
    }),
  ],

  session: {
    maxAge: 3000 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 3000 * 24 * 60 * 60,
  },

  callbacks: {
    async signIn({ user, account, profile }: any) {
      const getData = await prisma.users.findFirst({
        where: {
          email: profile.email,
        },
      });

      if (!getData) {
        const createGoogleUser = await prisma.users.create({
          data: {
            name: user.name,
            email: user.email,
            password: new Date() + user.id,
            provider_id: account?.providerAccountId,
            provider_type: account?.provider,
          },
        });

        if (createGoogleUser) {
          user.userId = createGoogleUser.id;
          return true;
        }
        return false;
      } else {
        user.userId = getData?.id;
        return true;
      }
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.userId = user.userId;
      }
      // token.userId = user?.userId || token.userId;
      return token;
    },
    async session({ token, user, session }: any) {
      session.user.userId = token?.userId;
      return session;
    },
  },
};

// export default (req: NextApiRequest, res: NextApiResponse) =>
//   NextAuth(req, res, authOptions);
export default NextAuth(authOptions);
