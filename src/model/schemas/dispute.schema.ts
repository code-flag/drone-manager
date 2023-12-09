import { config } from "dotenv";
import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import { IUpdatedBy } from "./types/schema.types";

config();

const { Schema } = mongoose;

interface IDispute {
  userId: any;
  productCategory: string,
  orderId: any,
  userName: string,
  disputeTicketId: string;
  description: string;
  disputeCategory: string;
  organization: any;
  txnId: string;
  name: string;
  email: String;
  image: string;
  resolveComment: string;
  userType: string;
  status: boolean;
  [key: string]: any;
}


const UpdatedBy = new Schema<IUpdatedBy>({
  staffId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Staff",
  },
  actionLevel: { type: Number },
  desc: { type: String },
});


const DisputeSchema = new Schema<IDispute>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "userIdRefPath",
    },
    orderId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "Order",
    },
    userIdRefPath: {
      type: String,
      enum: ["Users", "Organization"],
      required: true,
    },
    disputeTicketId: { type: String, unique: true },
    description: { type: String, required: true },
    disputeCategory: { type: String, required: true }, //enum: ["Transaction", "Settlement", "Refund"]
    userName: { type: String },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
    productCategory: { type: String, required: true },
    regNo: { type: String },
    trx_reference: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String },
    resolveComment: { type: String },
    status: { type: Boolean, required: true, default: false },
    userType: { type: String, required: true },
    updatedBy: [UpdatedBy]
  },
  {
    timestamps: true,
  }
);

DisputeSchema.plugin(paginate);

interface DisputeDocument extends mongoose.Document, IDispute {}

const Dispute = mongoose.model<
  DisputeDocument,
  mongoose.PaginateModel<DisputeDocument>
>("Dispute", DisputeSchema, "dispute");

export default Dispute;
