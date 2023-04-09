import jwt from "jsonwebtoken";

export default function isAuthenticated(req, res, next) {
  const secret = process.env.SECRET;
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in." });
  }

  const token = authorization.split(" ")[1];
  try {
    const { _id, privilege } = jwt.verify(token, secret);
    req._id = _id;
    req.privilege = privilege;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Request not authorized." });
  }
}
