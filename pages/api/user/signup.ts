import { ObjectId } from "mongoose";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/userAccounts";
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
  const { firstName, lastName, middleName, username, password } = req.body;

  await dbConnect();

  if (method == "POST") {
    
    try{
      const user = await User.signup(
        firstName,
        middleName,
        lastName,
        username,
        password
      );
      return res.status(200).json({ username });
    }catch(err: any){
      return res.status(400).json({error: err.message});
    }
  } else {
    return res.status(400).json({ success: false });
  }
}
