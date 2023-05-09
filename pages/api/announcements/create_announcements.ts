import { ObjectId } from "mongoose";
import dbConnect from "../../../lib/dbConnect";
import Announcement from "../../../models/announcementModel";
import { NextApiRequest, NextApiResponse } from "next";

interface Request extends NextApiRequest {
  title: string;
  content: string;
  date: Date;
  image: string;
}
export default async function handler(req: Request, res: NextApiResponse) {
  const { method } = req;
  const { title, content, image } = req.body;
  await dbConnect();
  const date = new Date();
  if (method == "POST") {
    const announcement = await Announcement.createAnnouncement(
      title,
      content,
      date,
      image
    );
    res.status(200).json({ announcement });
  } else {
    return res.status(400).json({ success: false });
  }
}
