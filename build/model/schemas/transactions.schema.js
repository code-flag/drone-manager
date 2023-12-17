"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import mongoosePaginate = require('mongoose-paginate-v2');
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const { Schema } = mongoose_1.default;
const UpdatedBy = new Schema({
    staffId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Staff",
    },
    actionLevel: { type: Number },
    desc: { type: String }
});
const TransactionsSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    fullName: { type: String },
    status: {
        type: String,
        required: true,
        enum: ["pending", "declined", "in-progress", "completed"],
        default: "pending",
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    narration: {
        type: String,
        default: null,
    },
    reference: {
        type: String,
    },
    updatedBy: [UpdatedBy]
}, {
    timestamps: true,
});
TransactionsSchema.set("toJSON", { virtuals: true }, {
    transform: function (doc, ret, options) {
        delete ret.key;
        delete ret.isDeleted;
        delete ret.__v;
    },
});
TransactionsSchema.plugin(mongoose_paginate_v2_1.default);
const Transactions = mongoose_1.default.model("Transactions", TransactionsSchema, "Transactions");
exports.default = Transactions;
