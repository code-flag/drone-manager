"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const { Schema } = mongoose_1.default;
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
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
}, {
    timestamps: true,
});
reviewSchema.plugin(mongoose_paginate_v2_1.default);
const review = mongoose_1.default.model("Review", reviewSchema, "review");
exports.default = review;
