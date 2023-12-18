"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const { Schema } = mongoose_1.default;
const ShippingSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        match: [/\S+@\S+\.\S+/, "A valid email is required."],
        lowercase: true,
        trim: true,
        unique: true,
    },
    phone: { type: String },
    address: { type: String, required: true },
}, {
    timestamps: true,
});
ShippingSchema.set("toJSON", { virtuals: true }, {
    transform: function (doc, ret, options) {
        delete ret.key;
        delete ret.isDeleted;
        delete ret.__v;
    },
});
ShippingSchema.plugin(mongoose_paginate_v2_1.default);
const Shipping = mongoose_1.default.model("Shipping", ShippingSchema, "shipping");
exports.default = Shipping;
