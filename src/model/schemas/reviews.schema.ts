import mongoose from "mongoose";
const { Schema } = mongoose;

const reviewSchema = new Schema({
userId: {type: String},
productId: {type: String},
rating: {type: String},
comment: {type: String},
},
{
  timestamps: true,
}
);

const review = mongoose.model("review", reviewSchema);
export default review;
