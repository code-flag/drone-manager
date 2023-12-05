import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const generateAuthToken = ({ id,_id, email}: any) =>
  jwt.sign({ id, _id, email}, process.env.JWT_SECRET ?? '', {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export default generateAuthToken;
