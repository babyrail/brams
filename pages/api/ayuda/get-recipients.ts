import dbConnect from "../../../lib/dbConnect";
import Assistance from "../../../models/assistanceModel";
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
        const assistance = await Assistance.find({}).sort({
          recipient_name: -1,
        }); /* find all the data in our database */
        res.status(200).json({ assistance });
      } catch (error) {
        res.status(400).json({ error: error });
      }
      break;

    default:
      res.status(400).json({ success: "error asdfs" });
      break;
  }
}
