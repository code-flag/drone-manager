import mongoose from "mongoose";
import paginate  from "mongoose-paginate-v2";

const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {type: String},
  parentId: {type: String},
  parentName: {type: String},
  desc: {type: String},
  type: {type: String, enum:["main", "sub"], default: "main", required: true}, // main or sub 
},
{
  timestamps: true,
}
);

interface ICategory {
  [key: string]: any
}

categorySchema.plugin(paginate);

interface ICategoryDocument extends mongoose.Document, ICategory {}

const category = mongoose.model<
  ICategoryDocument,
  mongoose.PaginateModel<ICategoryDocument>
>("Category", categorySchema, "category");

export default category;
