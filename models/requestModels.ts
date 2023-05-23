import mongoose, { Document, Model, Schema, model } from "mongoose";
import { ObjectId } from "mongodb";
export interface IRequest extends Document {
  user_id: ObjectId;
  user_name: string;
  request_type: string;
  request_date: Date;
  pickup_date: Date;
  status: string;
  purpose: string;
}
const requestSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  request_type: {
    type: Array,
    required: true,
  },
  request_date: {
    type: Date,
    required: true,
  },
  pickup_date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
});

const Requests =
  mongoose.models.Requests || model<IRequest>("Requests", requestSchema);

export default Requests;
