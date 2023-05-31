import mongoose, { Document, Model, Schema, model } from "mongoose";
import { ObjectId } from "mongodb";
export interface IRecentTrans extends Document {
  release_date: Date;
  clerk_name: string;
  user_id: ObjectId;
  user_name: string;
  user_age: Number;
  request_type: string;
  request_date: Date;
  pickup_date: Date;
  status: string;
  purpose: string;
  paymentMethod: string;
  refNum: string;
  price: Number;
}
const recentTransactionSchema = new Schema({
  release_date: {
    type: Date,
    required: true,
  },
  clerk_name: {
    type: String,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  user_age: {
    type: Number,
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
  status: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    required: true,
  },
  refNum: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const RecentTransaction =
  mongoose.models.RecentTransaction ||
  model<IRecentTrans>("RecentTransaction", recentTransactionSchema);

export default RecentTransaction;
