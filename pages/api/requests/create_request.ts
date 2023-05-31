import dbConnect from "../../../lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import Requests from "../../../models/requestModels";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const {
    user_id,
    user_name,
    user_age,
    request_type,
    purpose,
    paymentMethod,
    refNum,
    price,
  } = req.body;
  const request_date = new Date();
  let status = "";
  let reference: string;
  if (request_type.length == 0) {
    res.status(400).json({ error: "Request Type is required" });
  }
  const pickup_date = new Date();
  if (paymentMethod != "CASH") {
    status = "Payment Confirmation Pending";
    if (refNum == "" || refNum == null || refNum == undefined) {
      res.status(400).json({ error: "Reference Number is required" });
    }
    reference = refNum;
  } else {
    status = "Review Pending";
    reference = "N/A";
  }
  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const request = await Requests.create({
          user_id,
          user_name,
          user_age,
          request_type,
          request_date,
          pickup_date,
          status,
          purpose,
          paymentMethod,
          paymentStatus: "Pending",
          refNum: reference,
          price,
        });
        res.status(201).json({ success: true, data: request });
      } catch (error) {
        res.status(400).json({ error: "There's an error saving your request" });
      }
      break;
    default:
      res.status(400).json({ error: "Invalid Request" });
      break;
  }
}
