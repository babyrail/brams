import { ObjectId } from "mongoose";
import dbConnect from "../../lib/dbConnect";
import Admin from "../../models/adminAccounts";
import jwt, { Secret } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
const createToken = (_id: ObjectId) => {
  return jwt.sign({ _id }, process.env.SECRET as Secret, { expiresIn: "3d" });
};

interface Request extends NextApiRequest {
  _id: ObjectId;
  privilege: string;
}

export default async function handler(req: Request, res: NextApiResponse) {
  const { method } = req;
  const { username, password, privilege, image } = req.body;

  await dbConnect();

  if (method == "POST") {
    try {
      const user = await Admin.signup(username, password, privilege, image);
      res.status(200).json({ username });
    } catch (error: any) {
      res.status(400).json({ error: error?.message, body: req.body });
    }
  } else {
    return res.status(400).json({ success: false });
  }
}
