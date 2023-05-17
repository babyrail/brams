import dbConnect from "../../../lib/dbConnect";
import Records from "../../../models/BrgyRecords";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.body;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const records = await Records.deleteOne({ _id: id });
        res.status(200).json({ records });
      } catch (error) {
        res.status(400).json({ error: error });
      }
      break;
    default:
      res.status(400).json({ success: "error asdfs" });
      break;
  }
}
