import mongoose, { Schema, Document, model } from "mongoose";
import { ObjectId } from "mongodb";

export interface IAssistance extends Document {
  household_id: ObjectId;
  status: string;
}

const assistanceSchema = new Schema<IAssistance>({
  household_id: {
    type: ObjectId,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const Assistance =
  mongoose.models.Assistance ||
  model<IAssistance>("Assistance", assistanceSchema);

export default Assistance;
