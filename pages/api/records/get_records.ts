import dbConnect from "../../../lib/dbConnect";
import Records from "../../../models/BrgyRecords";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const records = await Records.find({}).sort({
          lastName: 1,
        }); /* find all the data in our database */
        res.status(200).json({ records });
      } catch (error) {
        res.status(400).json({ error: error });
      }
      break;
    case "POST":
      try {
        const records = await Records.find({ isFamilyHead: true }).sort({
          lastName: 1,
        });
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
