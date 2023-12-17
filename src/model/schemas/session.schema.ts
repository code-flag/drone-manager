import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
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

interface ISession {
  [key: string]: any;
}

sessionSchema.plugin(paginate);

interface ISessionDocument extends mongoose.Document, ISession {}

const session = mongoose.model<
  ISessionDocument,
  mongoose.PaginateModel<ISessionDocument>
>("Session", sessionSchema, "session");

export default session;