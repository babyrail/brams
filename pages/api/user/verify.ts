import { ObjectId } from "mongoose";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/userAccounts";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { code, name, expirationTime } = req.body;
  console.log(code, name, expirationTime);
  await dbConnect();
  console.log("verifying");

  if (method == "POST") {
    try {
      console.log("posting");
      const user = await User.findOne({ username: name });

      if (user) {
        if ((user?.expirationTime ? user?.expirationTime : 0) < new Date()) {
          return res.status(400).json({ message: "Verification code expired" });
        }
        if (user?.verificationCode == code) {
          const newUser = await User.updateOne(
            { username: name },
            { verified: true }
          );
          return res.status(200).json({ success: true });
        } else {
          return res
            .status(400)
            .json({ message: "Verification Code did not match" });
        }
      } else {
        return res.status(400).json({ message: "User not found" });
      }
    } catch (error) {
      return res
        .status(400)
        .json({ message: "There was an issue. Please try again later! " });
    }
  } else {
    return res.status(400).json({ message: "Invalid Request" });
  }
}
