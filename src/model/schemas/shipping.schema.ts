"use strict";

import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const {  Schema } = mongoose;

const ShippingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        match: [/\S+@\S+\.\S+/, "A valid email is required."],
        lowercase: true,
        trim: true,
        unique: true,
      },
    phone: {type: String},
    address: {type: String, required: true},
  },
  {
    timestamps: true,
  }
)



ShippingSchema.set("toJSON",
  { virtuals: true },
  {
    transform: function (doc: any, ret: any, options: any) {
      delete ret.key;
      delete ret.isDeleted;
      delete ret.__v;
    },
  }
);

ShippingSchema.plugin(paginate);

interface IShipping {
    [key: string]: any;
}

interface IShippingDoc extends mongoose.Document, IShipping {}

const Shipping = mongoose.model<
  IShippingDoc,
  mongoose.PaginateModel<IShippingDoc>
>("Shipping", ShippingSchema, "shipping");

export default Shipping;
