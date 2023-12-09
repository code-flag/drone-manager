import mongoose from "mongoose";
import { ICategory } from "./types/schema.types";

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

const Cart = mongoose.model("cart", cartSchema);
export default Cart;
