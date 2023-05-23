import dbConnect from "../../../lib/dbConnect";
import Records from "../../../models/BrgyRecords";
import { NextApiRequest, NextApiResponse } from "next";
import Archived from "../../../models/archiveModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id, adminName } = req.body;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        let archived;
        const records = await Records.findOne({ _id: id });
        if (records) {
          archived = {
            original_id: records._id,
            archived_date: new Date(),
            archived_by: adminName,
            firstName: records.firstName,
            lastName: records.lastName,
            middleName: records.middleName,
            suffix: records.suffix,
            birthDate: records.birthDate,
            gender: records.gender,
            civilStatus: records.civilStatus,
            occupation: records.occupation,
            email: records.email,
            contactNumber: records.contactNumber,
            addressLine1: records.addressLine1,
            addressLine2: records.addressLine2,
            barangay: records.barangay,
            city: records.city,
            province: records.province,
            isFamilyHead: records.isFamilyHead,
            brgy_records: records.brgy_records,
            image: records.image,
          };
        }

        const archive = await Archived.create({ ...archived });
        if (!archive) {
          return res.status(400).json({ error: "Error in archiving" });
        }

        const deleteRecord = await Records.deleteOne({ _id: id });
        if (!deleteRecord) {
          return res.status(400).json({ error: "Error in deleting" });
        }

        res.status(200).json({ archive: archive });
      } catch (error) {
        res.status(400).json({ error: error });
      }
      break;
    default:
      res.status(400).json({ success: "error asdfs" });
      break;
  }
}
