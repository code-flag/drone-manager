import mongoose from "mongoose";
import { ICategory } from "./types/schema.types";

const { Schema } = mongoose;

const categorySchema = new Schema({
  orderId:  {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },
  location: {type: String},
  status: {type: String},
  shipment: {type: String},  
},
{
  timestamps: true,
}
);

const Category = mongoose.model("category", categorySchema);
export default Category;
