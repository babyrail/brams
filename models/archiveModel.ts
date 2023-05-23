import mongoose, { Document, Schema, Types, model } from "mongoose";
export interface ArchivedData extends Document {
  _id: string;
  original_id: string;
  archived_date: Date;
  archived_by: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  birthDate: Date;
  gender: string;
  civilStatus: string;
  occupation?: string;
  email?: string;
  contactNumber?: number;
  addressLine1: string;
  addressLine2?: string;
  barangay: string;
  city: string;
  province: string;
  isFamilyHead: boolean;
  brgy_records?: any[];
  image: string;
}

const archiveSchema = new Schema({
  original_id: {
    type: Types.ObjectId,
    required: true,
  },
  archived_date: {
    type: Date,
    required: true,
  },
  archived_by: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  suffix: {
    type: String,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  civilStatus: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
  },
  email: {
    type: String,
  },
  contactNumber: {
    type: Number,
  },
  addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: {
    type: String,
  },
  barangay: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  isFamilyHead: {
    type: Boolean,
    required: true,
  },
  brgy_records: {
    type: Array,
    required: false,
  },
  image: {
    type: String,
    required: true,
  },
});

const Archived =
  mongoose.models.Archived || model<ArchivedData>("Archived", archiveSchema);

export default Archived;
