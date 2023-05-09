import { ObjectId } from "mongoose";
import dbConnect from "../../../lib/dbConnect";
import Admin from "../../../models/adminAccounts";
import { NextApiRequest, NextApiResponse } from "next";

interface Request extends NextApiRequest {
  _id: ObjectId;
  privilege: string;
  username: string;
}

export default async function handler(req: Request, res: NextApiResponse) {
  const { method } = req;
  const { username } = req.body;
  await dbConnect();

  if (method == "POST") {
    console.log(username);
    const users = await Admin.deleteOne({ username });
    return res.status(200).json({ users });
  } else {
    return res.status(400).json({ success: false });
  }
}
