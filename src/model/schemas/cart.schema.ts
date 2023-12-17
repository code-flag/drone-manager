import mongoose from "mongoose";
import paginate  from "mongoose-paginate-v2";

const { Schema } = mongoose;

const cartSchema = new Schema({
  productId:{
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  userId:{
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
},
{
  timestamps: true,
}
);

interface ICart {
  [key: string]: any;
}

cartSchema.plugin(paginate);

interface ICartDocument extends mongoose.Document, ICart {}

const cart = mongoose.model<
  ICartDocument,
  mongoose.PaginateModel<ICartDocument>
>("Cart", cartSchema, "cart");

export default cart;