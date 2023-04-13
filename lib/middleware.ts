import jwt, { Secret } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

interface Decoded {
  _id: string;
  privilege: string;
}

interface Request extends NextApiRequest {
  _id: string;
  privilege: string;
}

export default function isAuthenticated(
  req: Request,
  res: NextApiResponse,
  next: any
) {
  const secret = process.env.SECRET;
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in." });
  }

  const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secret as Secret);
    const { _id, privilege } = decoded as Decoded;
    req._id = _id;
    req.privilege = privilege;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Request not authorized." });
  }
}
