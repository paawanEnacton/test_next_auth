import { withAuth } from "next-auth/middleware";
import prisma from "./prisma/index";

export default withAuth({
  callbacks: {
    async authorized({ req, token }: any) {
      console.log("token :>> ", typeof token.userId);
      if (!token) {
        return false;
      }

      const getUserData = await prisma.users.findFirst({
        where: {
          id: token.userId,
          status: "active",
        },
      });

      if (!getUserData) {
        return false;
      }
      return true;
    },
  },
});

export const config = { matcher: ["/admin", "/me"] };
