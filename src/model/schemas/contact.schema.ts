import { config } from "dotenv";
import mongoose  from 'mongoose';
import paginate  from "mongoose-paginate-v2";

config();

const { Schema } = mongoose;

interface IContact {
    ticketId: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }

  const ContactSchema = new Schema({
    ticketId: { type: String, required: true, unique: true },
    name: { type: String, require: true },
    email: { type: String, require: true },
    phone: { type: String, require: true },
    subject: { type: String, require: true },
    message: { type: String,},
    contactType: { type: [String], required: true, enum: ["contact", "support", "enquiry"] },
    isRead: { type: Boolean, default: false },
   
  }); 
   
ContactSchema.plugin(paginate);

interface IContactDocument extends mongoose.Document, IContact {}

const contact = mongoose.model<
  IContactDocument,
  mongoose.PaginateModel<IContactDocument>
>("Contact", ContactSchema, "contact");

export default contact;


