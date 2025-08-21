import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); 

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const generateToken = (email) => {
  const token = jwt.sign({ email }, JWT_SECRET_KEY, { expiresIn: "1h" });
  return token;
};

export const verifyToken = (token) => {
  const decode = jwt.verify(token, JWT_SECRET_KEY);
  return decode.email;
};
