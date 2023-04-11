import dbConnect from "../../../lib/dbConnect";
import Records from "../../../models/BrgyRecords";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  //get token from bearer token
  let privilege = null;

  //get token from bearer token
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    //verify token
    const verified = jwt.verify(token, process.env.SECRET) as {
      privilege: string;
      _id: string;
    };
    console.log(verified);
    //get user id from verified token
    privilege = verified.privilege;
  }
  if (req.headers.authorization == null) {
    console.log("i want to die");
  }

  await dbConnect();
  console.log(method);
  console.log(privilege);
  switch (method) {
    case "GET":
      try {
        const { firstName, lastName, middleName } = req.query;
        let query = {};
        if (middleName) {
          query = { firstName, lastName, middleName };
        } else {
          query = { firstName, lastName };
        }

        const records = await Records.findOne(
          query
        ); /* find all the data in our database */
        res.status(200).json({ records });
      } catch (error) {
        res.status(400).json({ error: error });
      }
      break;
    case "POST":
      if (privilege == "admin") {
        try {
          const record = await Records.create(
            req.body
          ); /* create a new model in the database */
          res.status(201).json({ data: record });
        } catch (error) {
          res.status(400).json({ error: error });
        }
        break;
      }
    default:
      res.status(400).json({ success: "error asdfs" });
      break;
  }
}
