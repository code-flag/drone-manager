import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

interface IProduct {
  [key: string]: any;
}
const productSchema = new Schema<IProduct>({
name: {type: String},
desc: {type: String},
baseImage: {type: String},
imageVariation: [{type: String}],
categoryId:{
  type: Schema.Types.ObjectId,
  ref: "Category",
},
sku: {type: String},
quantity: {type: Number, default: 1},
basePrice: {type: Number, required: true},
discountPrice: {type: Number},
discountPercentage: {type: Number},
tags: [{type: String}],
salesRegion: {type: String},
reviews: {type: Number, required: true, default: 0},
ratings: {type: Number, required: true, default: 0},
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
