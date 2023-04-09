import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  username: string;
  password: string;
  privilege: string;
}

export interface IUserModel extends Model<IUser> {
  login(username: string, password: string): Promise<IUser>;
  signup(username: string, password: string, privilege: string): Promise<IUser>;
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
    required: false,
  },
});

userSchema.statics.login = async function (
  username: string,
  password: string
): Promise<IUser> {
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
): Promise<IUser> {
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

const User: IUserModel =
  mongoose.models.User || mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
