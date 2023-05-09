import mongoose, { Document, Model, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { Awaitable } from "next-auth";
export interface IAdmin extends Document {
  username: string;
  password: string;
  privilege: string | null;
}

export interface IAdminModel extends Model<IAdmin> {
  login(username: string, password: string): Awaitable<IAdmin | null>;
  signup(
    username: string,
    password: string,
    privilege: string,
    image: string
  ): Awaitable<IAdmin | null>;
}

const adminSchema = new Schema<IAdmin>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  privilege: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

adminSchema.statics.login = async function (
  username: string,
  password: string
): Promise<IAdmin | null> {
  if (!username || !password) {
    throw new Error("Please provide a username and password");
  }

  const user = await this.findOne({ username });
  if (!user) {
    throw new Error("Incorrect username");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Incorrect password");
  }

  return user;
};

adminSchema.statics.signup = async function (
  username: string,
  password: string,
  privilege: string,
  image: string
): Promise<IAdmin | null> {
  if (!username || !password) {
    throw new Error("Please provide a username and password");
  }
  const exists = await this.findOne({ username });
  if (exists) {
    throw new Error("Username already exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    username,
    password: hash,
    privilege,
    image,
  });

  return user;
};

const Admin: IAdminModel = (mongoose.models.Admin ||
  model<IAdmin, IAdminModel>("Admin", adminSchema)) as IAdminModel;

export default Admin;
