import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/userAccounts";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { name } = req.body;
  await dbConnect();

  if (method == "POST") {
  } else {
    return res.status(400).json({ message: "Invalid Request" });
  }
}
