import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/userRecords";
import jwt from "jsonwebtoken";

const createToken = (_id, privilege) => {
  return jwt.sign({ _id, privilege }, process.env.SECRET, { expiresIn: "3d" });
};

export default async function handler(req, res) {
  const { method } = req;
  const { username, password } = req.body;
  await dbConnect();

  if (method == "POST") {
    try {
      const user = await User.login(username, password);
      const token = createToken(user._id, user.privilege);
      console.log(user);
      res.status(200).json({ data: user.username, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    return res.status(400).json({ error: "Invalid request method" });
  }
}
