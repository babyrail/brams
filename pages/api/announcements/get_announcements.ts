import dbConnect from "../../../lib/dbConnect";
import Announcement from "../../../models/announcementModel";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  await dbConnect();
  if (method == "POST") {
    const announcement = await Announcement.find({});
    res.status(200).json({ announcement });
  } else {
    return res.status(400).json({ success: false });
  }
}
