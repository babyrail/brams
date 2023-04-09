import NextAuth, { Awaitable, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/userRecords";
import jwt from "jsonwebtoken";

// const secret = process.env.SECRET;
// const createToken = (_id, privilege) => {
//   return jwt.sign({ _id, privilege }, process.env.SECRET, { expiresIn: "3d" });
// };

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.SECRET,
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };
        await dbConnect();
        const user = await User.login(username, password);
        if (user) {
          // Extract role or privilege data from user object
          const { username, privilege } = user;
          console.log(`${privilege}`);
          // Check user's role or privilege and return session data accordingly
          if (privilege === "admin") {
            return {
              name: username,
              role: "admin",
              token: jwt.sign({ username, privilege }, process.env.SECRET, {
                expiresIn: "3d",
              }),
            };
          } else if (privilege === "basic") {
            return {
              name: username,
              role: "basic",
              token: jwt.sign({ username, privilege }, process.env.SECRET, {
                expiresIn: "3d",
              }),
            };
          }
        } else {
          return null;
        }
      },
    }),
  ],
  //create a callback function that will add user role from dtabase query to the session object
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.role = user.role as string;
        token.name = user.name as string;
      }
      return token;
    },
    async session({ session, token }) {
      session.role = token.role as string;
      session.name = token.name as string;
      return session;
    },
  },
};

export default NextAuth(authOptions);
