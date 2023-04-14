import mongoose from "mongoose";



const RecordSchema = new mongoose.Schema({
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

const BrgyRecords =
  mongoose.models.BrgyRecords || mongoose.model("BrgyRecords", RecordSchema);

export default BrgyRecords;
