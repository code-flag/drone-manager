"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const { Schema } = mongoose_1.default;
const sessionSchema = new Schema({
    userId: { type: String },
    device: { type: String }, // this is used for sub category to reference the main category schema
    ip: { type: String },
    token: { type: String }
}, {
    timestamps: true,
});
sessionSchema.plugin(mongoose_paginate_v2_1.default);
const session = mongoose_1.default.model("Session", sessionSchema, "session");
exports.default = session;
