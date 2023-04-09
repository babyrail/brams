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
  houseNumber: {
    type: Number,
    required: true,
  },
  purok_ST: {
    type: String,
    required: true,
  },
  blk: {
    type: Number,
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
  familyID: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const BrgyRecords =
  mongoose.models.BrgyRecords || mongoose.model("BrgyRecords", RecordSchema);

export default BrgyRecords;
