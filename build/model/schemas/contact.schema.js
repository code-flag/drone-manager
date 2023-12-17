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
const ContactSchema = new Schema({
    ticketId: { type: String, required: true, unique: true },
    name: { type: String, require: true },
    email: { type: String, require: true },
    phone: { type: String, require: true },
    subject: { type: String, require: true },
    message: { type: String, },
    contactType: { type: [String], required: true, enum: ["contact", "support", "enquiry"] },
    isRead: { type: Boolean, default: false },
});
ContactSchema.plugin(mongoose_paginate_v2_1.default);
const contact = mongoose_1.default.model("Contact", ContactSchema, "contact");
exports.default = contact;
