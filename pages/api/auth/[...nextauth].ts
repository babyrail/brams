import NextAuth, {
  Awaitable,
  NextAuthOptions,
  User as AuthUser,
  Session,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/userRecords";
import jwt from "jsonwebtoken";

// const secret = process.env.SECRET;
// const createToken = (_id, privilege) => {
//   return jwt.sign({ _id, privilege }, process.env.SECRET, { expiresIn: "3d" });
// };
interface CustomUser extends AuthUser {
  role: string;
  token: string;
}
interface CustomSession extends Session {
  role: string;
  name: string;
}
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
      async authorize(credentials, req): Promise<CustomUser | null> {
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
              id: user._id,
              name: username,
              role: "admin",
              token: jwt.sign({ username, privilege }, process.env.SECRET, {
                expiresIn: "3d",
              }),
            };
          } else if (privilege === "basic") {
            return {
              id: user._id,
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
        const customUser = user as CustomUser;
        token.role = customUser.role as string;
        token.name = customUser.name as string;
      }
      return token;
    },
    async session({ session, token }) {
      const customSession = session as CustomSession;
      customSession.role = token.role as string;
      customSession.name = token.name as string;
      return customSession;
    },
  },
};

export default NextAuth(authOptions);
