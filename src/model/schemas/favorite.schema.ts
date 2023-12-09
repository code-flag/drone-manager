import mongoose from "mongoose";
import { ICategory } from "./types/schema.types";

const { Schema } = mongoose;

const favoriteSchema = new Schema({
  productId:{
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  userId:{
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  }
},
{
  timestamps: true,
}
);

const Favorite = mongoose.model("favorite", favoriteSchema);
export default Favorite;
