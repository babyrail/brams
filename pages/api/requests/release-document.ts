import dbConnect from "../../../lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import Requests from "../../../models/requestModels";
import RecentTransaction from "../../../models/recentTransactionModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id, clerk_name } = req.body;
  const release_date = new Date();
  console.log(id);
  await dbConnect();
  switch (method) {
    case "POST":
      try {
        const request = await Requests.findById({ _id: id });
        const recentTrans = await RecentTransaction.create({
          release_date: release_date,
          clerk_name: clerk_name,
          user_id: request.user_id,
          user_name: request.user_name,
          user_age: request.user_age,
          request_type: request.request_type,
          request_date: request.request_date,
          status: request.status,
          purpose: request.purpose,
          paymentMethod: request.paymentMethod,
          paymentStatus: request.paymentStatus,
          refNum: request.refNum,
          price: request.price,
        });
        const request2 = await Requests.findByIdAndDelete({ _id: id });

        res
          .status(201)
          .json({ success: true, data: request2, data2: recentTrans });
      } catch (error) {
        res.status(400).json({ error: error });
      }
      break;
    default:
      res.status(400).json({ success: "error asdfs" });
      break;
  }
}
