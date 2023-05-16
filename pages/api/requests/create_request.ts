import dbConnect from "../../../lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import Requests from "../../../models/requestModels";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { user_id, request_type } = req.body;
  const request_date = new Date();
  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const request = await Requests.create({
          user_id,
          request_type,
          request_date,
        });
        res.status(201).json({ success: true, data: request });
      } catch (error) {
        res.status(400).json({ error: error });
      }
      break;
    default:
      res.status(400).json({ success: "error asdfs" });
      break;
  }
}
