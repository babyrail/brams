import { ObjectId } from "mongoose";
import dbConnect from "../../../lib/dbConnect";
import Admin from "../../../models/adminAccounts";
import { NextApiRequest, NextApiResponse } from "next";

interface Request extends NextApiRequest {
  _id: ObjectId;
  privilege: string;
}

export default async function handler(req: Request, res: NextApiResponse) {
  const { method } = req;

  await dbConnect();

  if (method == "POST") {
    const users = await Admin.find(
      { privilege: "admin" },
      { username: 1, privilege: 1, image: 1 }
    );

    return res.status(200).json({ users });
  } else {
    return res.status(400).json({ success: false });
  }
}
