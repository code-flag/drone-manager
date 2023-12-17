"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
(0, dotenv_1.config)();
const { Schema } = mongoose_1.default;
const UpdatedBy = new Schema({
    staffId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Staff",
    },
    actionLevel: { type: Number },
    desc: { type: String },
});
const DisputeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: "User",
    },
    orderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Order",
    },
    disputeTicketId: { type: String, unique: true },
    description: { type: String, required: true },
    disputeCategory: { type: String, required: true }, //enum: ["Transaction", "Settlement", "Refund"]
    userName: { type: String },
    productCategoryId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Category",
    },
    email: { type: String, required: true },
    image: { type: String },
    resolveComment: { type: String },
    status: { type: Boolean, required: true, default: false },
    updatedBy: [UpdatedBy]
}, {
    timestamps: true,
});
DisputeSchema.plugin(mongoose_paginate_v2_1.default);
const Dispute = mongoose_1.default.model("Dispute", DisputeSchema, "dispute");
exports.default = Dispute;
