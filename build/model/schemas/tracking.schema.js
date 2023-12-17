"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const trackingSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
    },
    location: { type: String },
    status: { type: String },
    shipment: { type: String },
}, {
    timestamps: true,
});
const tracking = mongoose_1.default.model("tracking", trackingSchema);
exports.default = tracking;
