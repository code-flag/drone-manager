import mongoose, { ConnectOptions } from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from "dotenv";
dotenv.config();

export const getURI = async () => {
  try {
    // const mongod = new MongoMemoryServer();
    let mongod: MongoMemoryServer;
    mongod = await MongoMemoryServer.create();

  const uri: string = process.env.NODE_ENV !== "production"? await mongod.getUri() : process.env.DB_CONNECTION_URL ?? "";
  console.log("db uri ", uri);
  return uri + "drone?retryWrites=true&w=majority";
  } catch (error: any) {
    console.log("uri err ", error);
    return "";
  }
}


mongoose.set("strictQuery", true);
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

export const DBConnection = async () => {
  mongoose.connect(
    await getURI(),
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