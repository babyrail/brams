import dbConnect from "../../../lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import Requests from "../../../models/requestModels";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.body;
  console.log(id);
  await dbConnect();
  switch (method) {
    case "POST":
      try {
        const request = await Requests.findByIdAndUpdate(
          { _id: id },
          { paymentStatus: "Approved", status: "Processing" }
        );
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
