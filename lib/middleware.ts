import jwt from "jsonwebtoken";

interface Decoded {
  _id: string;
  privilege: string;
}

export default function isAuthenticated(req, res, next) {
  const secret = process.env.SECRET;
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in." });
  }

  const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secret);
    const { _id, privilege } = decoded as Decoded;
    req._id = _id;
    req.privilege = privilege;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Request not authorized." });
  }
}
