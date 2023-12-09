import mongoose from "mongoose";
const { Schema } = mongoose;

const sessionSchema = new Schema({
  userId: {type: String},
  device: {type: String}, // this is used for sub category to reference the main category schema
  ip: {type: String},
  token: {type: String}  
},
{
  timestamps: true,
}
);

const Session = mongoose.model("session", sessionSchema);
export default Session;
