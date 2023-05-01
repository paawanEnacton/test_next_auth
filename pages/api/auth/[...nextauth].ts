import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { encode } from "punycode";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 0,
  },

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("{ user, account, profile, email, credentials }", {
        user,
        account,
        profile,
        email,
        credentials,
      });
      return true;
    },
    async jwt({ token, user, account }) {
      token.surname = "bhatttttt";
      return token;
    },
    async session({ token, user, session }) {
      console.log({ token, session });
      // session.surname = token
      return session;
    },
  },
};

export default NextAuth(authOptions);
