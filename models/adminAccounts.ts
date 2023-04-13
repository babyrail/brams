import mongoose, { Document, Model, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { Awaitable } from "next-auth";
export interface IUser extends Document {
  username: string;
  password: string;
  privilege: string | null;
}

export interface IUserModel extends Model<IUser> {
  login(username: string, password: string): Awaitable<IUser | null>;
  signup(
    username: string,
    password: string,
    privilege: string
  ): Awaitable<IUser | null>;
}

const userSchema = new Schema<IUser>({
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
});

userSchema.statics.login = async function (
  username: string,
  password: string
): Promise<IUser | null> {
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

userSchema.statics.signup = async function (
  username: string,
  password: string,
  privilege: string
): Promise<IUser | null> {
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
  });

  return user;
};

const User: IUserModel = (mongoose.models.User ||
  model<IUser, IUserModel>("User", userSchema)) as IUserModel;

export default User;
