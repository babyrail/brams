import dbConnect from "../../../lib/dbConnect";
import Records from "../../../models/BrgyRecords";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.body;
  console.log(id)
  await dbConnect();
  switch (method) {
    case "POST":
      try {
        const record = await Records.findById({ _id: id });
        if (!record)
          return res
            .status(400)
            .json({ success: false, data: "No record found" });
        res.status(200).json({ success: true, data: record });
      } catch (error) {
        res.status(400).json({ success: false ,error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
