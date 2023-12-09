"use strict";

import mongoose, { PaginateModel, Types } from "mongoose";
// import mongoosePaginate = require('mongoose-paginate-v2');
import paginate from "mongoose-paginate-v2";
import { config } from "dotenv";

config();

const { Schema, Document, model } = mongoose;

interface IProduct {
  [key: string]: any;
}
const productSchema = new Schema<IProduct>({
name: {type: String},
desc: {type: String},
baseImage: {type: String},
imageVariation: {type: String},
categoryId:{
  type: Schema.Types.ObjectId,
  required: true,
  ref: "Category",
},
sku: {type: String},
qty: {type: String},
price: {type: String},
basePrice: {type: String},
discountPrice: {type: String},
discountPercentage: {type: String},
tags: [{type: String}],
salesRegion: {type: String},
isArchived: { type: Boolean, default: false },
}, {
  timestamps: true
});


productSchema.set(
  "toJSON",
  { virtuals: true },
  {
    transform: function (doc: any, ret: any, options: any) {
      delete ret.key;
      delete ret.isDeleted;
      delete ret.__v;
      delete ret.id;
    },
  }
);

productSchema.plugin(paginate);

interface IProductDocument extends mongoose.Document, IProduct {}

const product = mongoose.model<
  IProductDocument,
  mongoose.PaginateModel<IProductDocument>
>("Product", productSchema, "product");

export default product;
