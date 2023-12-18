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
const dotenv_1 = require("dotenv");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
(0, dotenv_1.config)();
const { Schema } = mongoose_1.default;
// interface IUserModel extends Model<IUser> {
//   encryptPassword(password: any): any;
//   tempSecret(secret: any): any;
// }
const UserSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    countryCode: { type: String },
    phone: { type: String },
    avatar: { type: String },
    gender: { type: String },
    addressPrimary: { type: String },
    addressSecondary: { type: String },
    shippingAddress: { type: String },
    regNo: { type: String },
    secretBase: { type: String },
    otpAuthUrl: { type: String },
    email: {
        type: String,
        required: [true, "Email is required."],
        match: [/\S+@\S+\.\S+/, "A valid email is required."],
        lowercase: true,
        trim: true,
        unique: true,
    },
    multiFactorAuth: { type: Boolean, default: false },
    password: {
        type: String,
        select: false,
        required: [true, "Password is required."],
    },
    otp: { type: String, select: false },
    otpTime: { type: Date, select: false },
    confirmationToken: { type: String, select: false },
    oneTimePassword: {
        type: Boolean,
        required: true,
        default: false,
    },
    firebaseNotificationToken: {
        type: String,
    },
    TCAgreement: {
        type: Boolean,
        required: true,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
});
UserSchema.pre("save", function (next) {
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
// UserSchema.statics.findToken = async function (token) {
//   return this.findOne({ firebaseNotificationToken: token });
// };
UserSchema.methods.validatePassword = function validatePassword(password) {
    return bcryptjs_1.default.compareSync(password, this.password);
};
UserSchema.set("toJSON", {
    transform: function (doc, ret, options) {
        delete ret.password;
        delete ret.firebaseNotificationToken;
        delete ret.__v;
    },
});
// UserSchema.plugin(paginate);
// const user = model<IUser>("User", UserSchema);
// export default user;
UserSchema.plugin(mongoose_paginate_v2_1.default);
const user = mongoose_1.default.model("User", UserSchema, "user");
exports.default = user;
