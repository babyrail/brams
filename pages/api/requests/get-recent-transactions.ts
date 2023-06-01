import dbConnect from "../../../lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import RecentTransaction from "../../../models/recentTransactionModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.body;
  await dbConnect();
  switch (method) {
    case "GET":
      try {
        const recent = await RecentTransaction.find({})
          .sort({
            release_date: -1,
          })
          .limit(5);
        res.status(201).json({ success: true, data: recent });
      } catch (error) {
        res.status(400).json({ error: error });
      }
      break;
    case "POST":
      try {
        const recent = await RecentTransaction.find({ user_id: id }).sort({
          release_date: -1,
        });
        res.status(201).json({ success: true, data: recent });
      } catch (error) {
        res.status(400).json({ error: error });
      }
      break;
    default:
      res.status(400).json({ success: "error asdfs" });
      break;
  }
}
