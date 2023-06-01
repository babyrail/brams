import dbConnect from "../../../lib/dbConnect";
import Household from "../../../models/householdModel";
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
        const households = await Household.find({}).sort({
          head_of_family: 1,
        }); /* find all the data in our database */
        res.status(200).json({ households });
      } catch (error) {
        res.status(400).json({ error: error });
      }
      break;

    default:
      res.status(400).json({ success: "error asdfs" });
      break;
  }
}
