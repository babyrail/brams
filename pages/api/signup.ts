import dbConnect from "../../lib/dbConnect";
import User from "../../models/userRecords";
import jwt from "jsonwebtoken";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

export default async function handler(req, res) {
  const { method } = req;
  const { username, password, privilege } = req.body;

  await dbConnect();

  if (method == "POST") {
    try {
      const user = await User.signup(username, password, privilege);

      res.status(200).json({ username });
    } catch (error) {
      res.status(400).json({ error: error.message, body: req.body });
    }
  } else {
    return res.status(400).json({ success: false });
  }
}
