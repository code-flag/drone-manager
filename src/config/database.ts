import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const url: string = process.env.DB_CONNECTION_URL ?? "";

mongoose.set("strictQuery", true);
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

export const DBConnection = () => {
  mongoose.connect(
    url,
    options  as ConnectOptions,
    (err: any) => {
      if (err) {
        console.log("error could not connect to database \n", err?.message);
      } else {
        console.log("Database successfully connected");
      }
    }
  );
};