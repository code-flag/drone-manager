"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const { Schema } = mongoose_1.default;
const cartSchema = new Schema({
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
}, {
    timestamps: true,
});
cartSchema.plugin(mongoose_paginate_v2_1.default);
const cart = mongoose_1.default.model("Cart", cartSchema, "cart");
exports.default = cart;
