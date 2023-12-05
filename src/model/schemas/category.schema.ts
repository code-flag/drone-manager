import mongoose from "mongoose";
import { ICategory } from "./types/schema.types";

const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {type: String},
  parentId: {type: String},
  desc: {type: String},
  image: {type: String},
  type: {type: String},
  
},
{
  timestamps: true,
}
);

const Category = mongoose.model("category", categorySchema);
export default Category;
