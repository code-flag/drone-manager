import mongoose from "mongoose";
import paginate  from "mongoose-paginate-v2";
const { Schema } = mongoose;

interface IReview {
  [key: string]: any
}


const reviewSchema = new Schema({
userId: {
  type: Schema.Types.ObjectId,
  required: true,
  ref: "User",
},
productId: {
  type: Schema.Types.ObjectId,
  required: true,
  ref: "Product",
},
rating: {type: Number, required: true},
comment: {type: String, required: true},
},
{
  timestamps: true,
}
);

reviewSchema.plugin(paginate);

interface IReviewDocument extends mongoose.Document, IReview {}

const review = mongoose.model<
  IReviewDocument,
  mongoose.PaginateModel<IReviewDocument>
>("Review", reviewSchema, "review");

export default review;