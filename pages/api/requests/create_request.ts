import dbConnect from "../../../lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import Requests from "../../../models/requestModels";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { user_id, user_name, request_type, pickup_date, purpose } = req.body;
  const request_date = new Date();
  const status = "pending";
  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const request = await Requests.create({
          user_id,
          user_name,
          request_type,
          request_date,
          pickup_date,
          status,
          purpose,
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
