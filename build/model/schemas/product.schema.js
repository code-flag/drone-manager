"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const { Schema } = mongoose_1.default;
const productSchema = new Schema({
    name: { type: String },
    desc: { type: String },
    baseImage: { type: String },
    imageVariation: [{ type: String }],
    categoryId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Category",
    },
    subCategoryId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Category",
    },
    sku: { type: String },
    quantity: { type: Number, default: 1 },
    basePrice: { type: Number, required: true },
    discountPrice: { type: Number },
    discountPercentage: { type: Number },
    tags: [{ type: String }],
    salesRegion: { type: String },
    reviews: { type: Number, default: 0 },
    ratings: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false },
}, {
    timestamps: true
});
productSchema.set("toJSON", { virtuals: true }, {
    transform: function (doc, ret, options) {
        delete ret.key;
        delete ret.isDeleted;
        delete ret.__v;
        delete ret.id;
    },
});
productSchema.plugin(mongoose_paginate_v2_1.default);
const product = mongoose_1.default.model("Product", productSchema, "product");
exports.default = product;
