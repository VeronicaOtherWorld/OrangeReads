import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export function verifyJWT(req) {
  try {
    const token = req.cookies.get("token")?.valueOf;
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return null;
  }
}
