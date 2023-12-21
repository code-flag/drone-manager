"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const { Schema } = mongoose_1.default;
const categorySchema = new Schema({
    name: { type: String },
    parentId: { type: String },
    parentName: { type: String },
    desc: { type: String },
    type: { type: String, enum: ["main", "sub"], default: "main", required: true }, // main or sub 
}, {
    timestamps: true,
});
categorySchema.plugin(mongoose_paginate_v2_1.default);
const category = mongoose_1.default.model("Category", categorySchema, "category");
exports.default = category;
