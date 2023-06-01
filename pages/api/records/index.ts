import dbConnect from "../../../lib/dbConnect";
import Records from "../../../models/BrgyRecords";
import jwt, { Secret } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import Household from "../../../models/householdModel";
import Assistance from "../../../models/assistanceModel";

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
    const verified = jwt.verify(token, process.env.SECRET as Secret) as {
      privilege: string;
      _id: string;
    };
    console.log(verified);
    //get user id from verified token
    privilege = verified.privilege;
  }

  await dbConnect();

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
      if (privilege == "superadmin") {
        const {
          firstName,
          lastName,
          middleName,
          suffix,
          birthDate,
          gender,
          civilStatus,
          occupation,
          email,
          contactNumber,
          addressLine1,
          addressLine2,
          barangay,
          city,
          province,
          isFamilyHead,
          brgy_records,
          image,
          member_count,
          familyMonthlyIncome,
        } = req.body;
        const createRecord = {
          firstName,
          lastName,
          middleName,
          suffix,
          birthDate,
          gender,
          civilStatus,
          occupation,
          email,
          contactNumber,
          addressLine1,
          addressLine2,
          barangay,
          city,
          province,
          isFamilyHead,
          brgy_records,
          image,
        };

        if (isFamilyHead) {
          let eligible_for_aid = false;
          if (familyMonthlyIncome < 20000) {
            eligible_for_aid = true;
          }

          try {
            const record = await Records.create(createRecord);
            console.log(record?._id);
            const family = await Household.create({
              head_of_family: `${firstName} ${lastName}`,
              head_of_family_id: record?._id,
              address: `${addressLine1} ${addressLine2}`,
              contactDetails: {
                email: email,
                contact_number: contactNumber,
              },
              member_count: member_count,
              familyMonthlyIncome: familyMonthlyIncome,
              eligible_for_aid: eligible_for_aid,
            });
            console.log("this was reached");
            console.log(family);
            const assistance = await Assistance.create({
              household_id: family._id,
              recipient_id: record._id,
              recipient_name: `${lastName}, ${firstName} ${middleName}`,
              status: "Unclaimed",
            });
            res.status(201).json({
              data: record,
              familyData: family,
              assistanceData: assistance,
            });
          } catch (error) {
            res.status(400).json({ error: error });
          }
        } else {
          try {
            const record = await Records.create(createRecord);
            res.status(201).json({ data: record });
          } catch (error) {
            res.status(400).json({ error: error });
          }
        }
      }
      break;
    default:
      res.status(400).json({ success: "error asdfs" });
      break;
  }
}
