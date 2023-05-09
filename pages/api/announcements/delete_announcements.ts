import dbConnect from "../../../lib/dbConnect";
import Announcement from "../../../models/announcementModel";
import { NextApiRequest, NextApiResponse } from "next";

interface Request extends NextApiRequest {
  _id: string;
}
export default async function handler(req: Request, res: NextApiResponse) {
  const { method } = req;
  const { _id } = req.body;
  await dbConnect();
  console.log(_id);
  if (method == "POST") {
    const announcement = await Announcement.deleteOne({ _id });
    res.status(200).json({ announcement });
  } else {
    return res.status(400).json({ success: false });
  }
}
