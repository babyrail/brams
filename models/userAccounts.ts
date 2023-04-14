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
}

export interface IUserModel extends Model<IUser> {
  login(username: string, password: string): Promise<IUser | null>;
  signup(firstName: string, middleName: string, lastName: string, username: string, password: string): Promise<IUser | null>;
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

userSchema.statics.signup = async function(firstName: string, middleName: string, lastName: string, username: string, password: string): Promise<IUser| null>{
  if(!firstName || !lastName || !username || !password){
    throw new Error("Fill up the everything");
  }
  await dbConnect()
  const exists = await fetch(
    `http://localhost:3000/api/records/?firstName=${firstName.toUpperCase()}&lastName=${lastName.toUpperCase()}&middleName=${middleName.toUpperCase()}`
  ) as any;

  if(exists.ok){
    const response = await exists.json()
    console.log(exists);
    console.log(response);
    console.log(response?.records._id)
    console.log(response?.records.firstName)
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);
   
    const user = await this.create({username, password: hash, verified: false, user_id: response?.records._id})
    return user;
  }
  if(!exists){
    throw new Error("Not a resident");
  }
  else{
    throw new Error("error")
  }

 
}

const User: IUserModel = (mongoose.models.User|| model<IUser, IUserModel>('User', userSchema)) as IUserModel;

export default User;