import NextAuth, {
  NextAuthOptions,
  User as AuthUser,
  Session,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../lib/dbConnect";
import Admin from "../../../models/adminAccounts";
import jwt from "jsonwebtoken";
import { Secret } from "jsonwebtoken";
import User from "../../../models/userAccounts";
import { ObjectId } from "mongoose";
import client from "../../../lib/twilio";
// const secret = process.env.SECRET;
// const createToken = (_id, privilege) => {
//   return jwt.sign({ _id, privilege }, process.env.SECRET, { expiresIn: "3d" });
// };
export interface CustomUser extends AuthUser {
  role: string;
  token: string;
  verificationCode?: number;
  expirationTime?: Date;
  verified?: boolean;
}

export interface CustomSession extends Session {
  role: string;
  name: string;
  accessToken: string;
  id: string;
  verificationCode?: number;
  expirationTime?: Date;
  verified?: boolean;
}
async function sendVerification(code: number) {
  try {
    const message = await client.messages.create({
      body: `Your verification code is ${code}`, // Message body
      from: "+12705947855", // Your Twilio phone number
      to: "+639999546329", // Recipient's phone number
    });
    console.log(message.sid); // Log the message SID if successful
    console.log(message.status); // Log the message status if successful
  } catch (error) {
    console.error(error); // Log any errors
  }
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
      id: "admin-login",
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
        const user = await Admin.login(username, password);
        if (user) {
          // Extract role or privilege data from user object
          const { username, privilege } = user;
          console.log(`${privilege}`);
          // Check user's role or privilege and return session data accordingly
          if (privilege === "superadmin") {
            return {
              id: user._id,
              name: username,
              role: "superadmin",
              token: jwt.sign(
                { username, privilege },
                process.env.SECRET as Secret,
                {
                  expiresIn: "3d",
                }
              ),
            };
          } else if (privilege === "admin") {
            return {
              id: user._id,
              name: username,
              role: "admin",
              token: jwt.sign(
                { username, privilege },
                process.env.SECRET as Secret,
                {
                  expiresIn: "3d",
                }
              ),
            };
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: "user-login",
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
        console.log("log in auth", user);
        if (user) {
          const {
            username,
            verified,
            user_id,
            verificationCode,
            expirationTime,
          } = user;
          console.log(user);
          if (verified) {
            return {
              id: user_id.toString(),
              name: username,
              role: "user",
              token: jwt.sign(
                {
                  id: user_id,
                  name: username,
                  verified,
                },
                process.env.SECRET as Secret,
                {
                  expiresIn: "3d",
                }
              ),
            };
          } else {
            sendVerification(verificationCode ? verificationCode : 0);
            return {
              name: username,
              verificationCode,
              expirationTime,
              id: user_id.toString(),
              role: "unverified",
              token: jwt.sign(
                {
                  id: user_id,
                  name: username,
                  verified: false,
                },
                process.env.SECRET as Secret,
                { expiresIn: "3d" }
              ),
            };
          }
        } else {
          throw new Error("Invalid username or password");
        }
      },
    }),
  ],
  //create a callback function that will add user role from dtabase query to the session object
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        const customUser = user as CustomUser;
        if (customUser.role === "user") {
          const customUser = user as CustomUser;
          token.role = customUser.role as string;
          token.name = customUser.name as string;
          token.token = customUser.token as string;
          token.id = customUser.id as string;
        } else if (
          customUser.role === "admin" ||
          customUser.role === "superadmin"
        ) {
          token.role = customUser.role as string;
          token.name = customUser.name as string;
          token.token = customUser.token as string;
        } else {
          token.role = "unverified";
          token.name = customUser.name as string;
          token.token = customUser.token as string;
          token.verificationCode = customUser.verificationCode as number;
          token.expirationTime = customUser.expirationTime as Date;
          token.verified = customUser.verified as boolean;
        }
      }
      return token;
    },
    async session({ session, token }) {
      const customSession = session as CustomSession;
      if (token.role === "user") {
        customSession.role = token.role as string;
        customSession.accessToken = token.token as string;
        customSession.name = token.name as string;
        customSession.id = token.id as string;
      }
      if (token.role === "admin" || token.role === "superadmin") {
        customSession.role = token.role as string;
        customSession.accessToken = token.token as string;
        customSession.name = token.name as string;
      }
      if (token.role === "unverified") {
        customSession.role = token.role as string;
        customSession.accessToken = token.token as string;
        customSession.name = token.name as string;
        customSession.id = token.id as string;
        customSession.verificationCode = token.verificationCode as number;
        customSession.expirationTime = token.expirationTime as Date;
        customSession.verified = token.verified as boolean;
      }
      return customSession;
    },
  },
};

export default NextAuth(authOptions);
