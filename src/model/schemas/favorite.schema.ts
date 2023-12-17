import mongoose from "mongoose";
import { ICategory } from "./types/schema.types";
import paginate from "mongoose-paginate-v2";

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

interface IFavorite {
  [key: string]: any;
}

favoriteSchema.plugin(paginate);

interface IFavoriteDocument extends mongoose.Document, IFavorite {}

const favorite = mongoose.model<
  IFavoriteDocument,
  mongoose.PaginateModel<IFavoriteDocument>
>("Favorite", favoriteSchema, "favorite");

export default favorite;