import { Head } from "next/document";
import mongoose, { Schema, Document, model } from "mongoose";
import { ObjectId } from "mongodb";

export interface IHousehold extends Document {
  head_of_family: string;
  head_of_family_id: ObjectId;
  address: string;
  contactDetails: {
    email: string;
    contact_number: string;
  };
  member_count: number;
  familyMonthlyIncome: number;
  eligible_for_aid: boolean;
}

const householdSchema = new Schema<IHousehold>({
  head_of_family: {
    type: String,
    required: true,
  },
  head_of_family_id: {
    type: ObjectId,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contactDetails: {
    email: {
      type: String,
    },
    contact_number: {
      type: String,
      required: true,
    },
  },
  member_count: {
    type: Number,
    required: true,
  },
  familyMonthlyIncome: {
    type: Number,
    required: true,
  },
  eligible_for_aid: {
    type: Boolean,
    required: true,
  },
});

const Household =
  mongoose.models.Household || model<IHousehold>("Household", householdSchema);

export default Household;
