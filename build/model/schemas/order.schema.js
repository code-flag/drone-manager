"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const { Schema } = mongoose_1.default;
const OrderSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Product",
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    // shippingId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Shipping",
    // },
    status: {
        type: String,
        enum: ["delivered", "processing", "pending", "in-progress", "shipping", "shipped"],
        default: "pending"
    },
    quantity: { type: Number, required: true },
    price: { type: Number }, // price per one
    isTracking: { type: Boolean, required: true, default: false },
    trackingId: { type: String },
    paymentId: {
        type: Schema.Types.ObjectId,
        ref: "Transactions",
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
});
OrderSchema.set("toJSON", {
    transform: function (doc, ret, options) {
        delete ret.password;
        delete ret.firebaseNotificationToken;
        delete ret.__v;
    },
});
OrderSchema.plugin(mongoose_paginate_v2_1.default);
const order = mongoose_1.default.model("Order", OrderSchema, "order");
exports.default = order;
