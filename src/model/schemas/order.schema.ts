import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import { config } from "dotenv";
import { IUser } from "./types/schema.types";

config();

const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // shippingId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Shipping",
    // },
    status: {
      type: String,
      enum: ["delivered", "processing", "pending","in-progress", "shipping", "shipped"],
      default: "pending"
    },
    shippingAddress: {type: String, required: true},
    quantity: { type: Number, required: true },
    price: { type: Number }, // price per one
    isTracking: { type: Boolean, required: true, default: false },
    trackingId: {type: String},
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Transactions",
    },
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
