import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import { config } from "dotenv";
import { IUser } from "./types/schema.types";

config();

const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    productId: { type: String, required: true },
    userId: { type: String, required: true },
    shippingId: { type: String, required: true },
    status: { type: String, required: true },
    isTracking: { type: String, required: true },
    paymentChannel: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    paymentId: { type: String, required: true },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

OrderSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.password;
    delete ret.firebaseNotificationToken;
    delete ret.__v;
  },
});


OrderSchema.plugin(paginate);

interface IOrderDocument extends mongoose.Document, IUser {}

const order = mongoose.model<
  IOrderDocument,
  mongoose.PaginateModel<IOrderDocument>
>("Order", OrderSchema, "order");

export default order;
