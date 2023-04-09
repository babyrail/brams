import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema =
  new Schema() <
  IUser >
  {
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
  };

userSchema.statics.login = async function (username, password) {
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

userSchema.statics.signup = async function (username, password, privilege) {
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

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
