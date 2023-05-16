import mongoose, { Document, ObjectId, Model, model } from "mongoose";
import bcrypt from "bcrypt";
import dbConnect from "../lib/dbConnect";

const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

export interface IUser extends Document {
  username: string;
  password: string;
  verified: boolean;
  user_id: ObjectId;
  verificationCode?: number;
  expirationTime?: Date;
}

export interface IUserModel extends Model<IUser> {
  login(username: string, password: string): Promise<IUser | null>;
  signup(
    firstName: string,
    middleName: string,
    lastName: string,
    username: string,
    password: string
  ): Promise<IUser | null>;
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
  },
  user_id: {
    type: ObjectId,
    required: true,
  },
  verificationCode: {
    type: Number,
  },
  expirationTime: {
    type: Date,
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
  firstName: string,
  middleName: string,
  lastName: string,
  username: string,
  password: string
): Promise<IUser | null> {
  if (!firstName || !lastName || !username || !password) {
    throw new Error("Fill up the everything");
  }
  const environment = process.env.NODE_ENV;
  let apiUrl = "";
  if (environment === "development") {
    apiUrl = `http://localhost:3000/api/records/?firstName=${firstName.toUpperCase()}&lastName=${lastName.toUpperCase()}&middleName=${middleName.toUpperCase()}`;
  } else {
    apiUrl = `https://barms.vercel.app/api/records/?firstName=${firstName.toUpperCase()}&lastName=${lastName.toUpperCase()}&middleName=${middleName.toUpperCase()}`;
  }
  console.log(apiUrl);
  await dbConnect();
  const exists = await fetch(apiUrl, {
    method: "GET",
  });

  const response = await exists.json();
  console.log(response);
  if (response.records == null) {
    throw new Error("Not a resident");
  }

  const userExists = await this.findOne({ username });
  if (userExists) {
    throw new Error("Username already exists");
  }

  const userExists2 = await this.findOne({ user_id: response?.records._id });
  if (userExists2) {
    throw new Error("Resident already has an account");
  }

  //

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  //generate random 4 digit number
  const verificationCode = Math.floor(1000 + Math.random() * 9000);
  //generea random 5 minute expiration time
  const expirationTime = new Date(Date.now() + 5 * 60 * 1000);

  const user = await this.create({
    username,
    password: hash,
    verified: false,
    user_id: response?.records._id,
    verificationCode,
    expirationTime,
  });
  return user;
};

const User: IUserModel = (mongoose.models.User ||
  model<IUser, IUserModel>("User", userSchema)) as IUserModel;

export default User;
