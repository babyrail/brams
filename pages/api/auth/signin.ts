import { ObjectId } from "mongoose";
import dbConnect from "../../../lib/dbConnect";
import Admin from "../../../models/adminAccounts";
import jwt, { Secret } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const createToken = (_id: ObjectId, privilege: string) => {
  return jwt.sign({ _id, privilege }, process.env.SECRET as Secret, {
    expiresIn: "3d",
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { username, password } = req.body;
  await dbConnect();

  if (method == "POST") {
    try {
      const user = (await Admin.login(username, password)) as {
        privilege: string;
        username: string;
        _id: ObjectId;
      };
      const token = createToken(user?._id, user?.privilege);
      console.log(user);
      res.status(200).json({ data: user?.username, token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  } else {
    return res.status(400).json({ error: "Invalid request method" });
  }
}
