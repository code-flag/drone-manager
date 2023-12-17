"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const dotenv_1 = require("dotenv");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
(0, dotenv_1.config)();
const { Schema } = mongoose_1.default;
const accountDetail = new Schema({
    accountName: { type: String, required: true },
    bankName: { type: String, required: true },
    accountNumber: { type: String },
});
const UpdatedBy = new Schema({
    staffId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Staff",
    },
    actionLevel: { type: Number },
    desc: { type: String },
});
const staffSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    avatar: { type: String },
    address: { type: String, required: true },
    proofOfAddress: { type: String },
    nin: { type: String },
    proofOfNIN: { type: String },
    country: { type: String, default: "Nigeria" },
    state: { type: String },
    lga: { type: String },
    department: { type: String },
    staffCode: { type: String },
    role: {
        type: String,
        enum: ["staff", "admin", "support", "accountant", "developer", "technical", "operation", "marketer", "super-admin"],
        default: "staff",
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        match: [/\S+@\S+\.\S+/, "A valid email is required."],
        lowercase: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        select: false,
        required: [true, "Password is required."],
    },
    confirmationToken: { type: String, select: false },
    secretBase: { type: String },
    otpAuthUrl: { type: String },
    multiFactorAuth: { type: Boolean, default: false },
    oneTimePassword: {
        type: Boolean,
        required: true,
        default: true,
    },
    firebaseNotificationToken: {
        type: String,
    },
    updatedBy: [UpdatedBy],
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
});
staffSchema.pre("save", function (next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            const saltRounds = yield bcryptjs_1.default.genSalt(Number(process.env.SALT_ROUNDS));
            this.password = (_b = (yield bcryptjs_1.default.hash((_a = this.password) !== null && _a !== void 0 ? _a : "", saltRounds))) !== null && _b !== void 0 ? _b : "";
            next();
        }
        next();
    });
});
staffSchema.statics.findToken = function (token) {
    return __awaiter(this, void 0, void 0, function* () {
        return this.findOne({ firebaseNotificationToken: token });
    });
};
staffSchema.methods.validatePassword = function validatePassword(password) {
    return bcryptjs_1.default.compareSync(password, this.password);
};
staffSchema.methods.encryptPassword = function encryptPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const saltRounds = yield bcryptjs_1.default.genSalt(Number(process.env.SALT_ROUNDS));
        return bcryptjs_1.default.hash(password, saltRounds);
    });
};
staffSchema.set("toJSON", {
    transform: function (doc, ret, options) {
        delete ret.password;
        delete ret.firebaseNotificationToken;
        delete ret.__v;
    },
});
staffSchema.plugin(mongoose_paginate_v2_1.default);
const staff = mongoose_1.default.model("staff", staffSchema);
exports.default = staff;
