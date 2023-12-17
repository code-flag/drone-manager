import mongoose from "mongoose";

const { Schema } = mongoose;

const trackingSchema = new Schema({
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

const tracking = mongoose.model("tracking", trackingSchema);
export default tracking;
