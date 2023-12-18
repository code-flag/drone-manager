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
exports.validateToken = exports.Activate2Fa = void 0;
const speakeasy_1 = __importDefault(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
const error_1 = require("../helper/error");
const message_handler_1 = require("../helper/message-handler");
const jwtAuth_1 = require("../helper/jwtAuth");
const index_schema_1 = require("../model/index.schema");
// when user toggles to activate 2FA
const Activate2Fa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, userType } = req.query;
    const secret = speakeasy_1.default.generateSecret();
    let findUser;
    if (userType === 'user') {
        findUser = yield index_schema_1.User.findOne({ _id: userId });
    }
    if (userType === 'staff' || userType === 'admin') {
        findUser = yield index_schema_1.Staff.findOne({ _id: userId });
    }
    if (!findUser) {
        throw new error_1.NotFoundError("Unable to generate Secret for this user");
    }
    const otpauth_url = speakeasy_1.default.otpauthURL({
        secret: secret.ascii,
        label: 'Market_Place',
        issuer: `Market_Place-${userType} 2FA`,
    });
    // Generate a QR code image and send it as a response
    qrcode_1.default.toDataURL(otpauth_url, (err, data_url) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            throw new error_1.BadRequestError("Could not generate qrcode");
        }
        const userData = { "otpAuthUrl": otpauth_url };
        userData["secretBase"] = secret.base32;
        if (userType === 'user') {
            findUser = yield index_schema_1.User.findOneAndUpdate({ _id: userId }, { $set: userData }, { new: true });
        }
        if (userType === 'staff' || userType === 'admin') {
            findUser = yield index_schema_1.Staff.findOneAndUpdate({ _id: userId }, { $set: userData }, { new: true });
        }
        if (!findUser) {
            throw new error_1.NotFoundError("Unable to generate Secret for this user");
        }
        (0, message_handler_1.returnMsg)(res, { MFAQrcode: data_url }, "User Secret generated successfully");
    }));
});
exports.Activate2Fa = Activate2Fa;
// Define a function for token validation
const validateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, userType, token } = req.body;
    let findUser;
    if (userType === 'user') {
        findUser = yield index_schema_1.User.findOne({ _id: userId });
    }
    if (userType === 'staff' || userType === 'admin') {
        findUser = yield index_schema_1.Staff.findOne({ _id: userId });
    }
    if (!findUser) {
        throw new error_1.NotFoundError("Unable to generate Secret for this user");
    }
    const tokenValidates = speakeasy_1.default.totp.verify({
        secret: findUser === null || findUser === void 0 ? void 0 : findUser.secretBase,
        encoding: 'base32',
        token: token,
        window: 6, // Number of 30-second windows to check (adjust as needed)
    });
    if (!tokenValidates) {
        throw new error_1.BadRequestError("could not validate token");
    }
    let UserToken;
    if (findUser.multiFactorAuth === true) {
        UserToken = (0, jwtAuth_1.generateAuthToken)({
            id: findUser._id,
            _id: userType,
            email: findUser.email,
        });
    }
    else {
        if (userType === 'user') {
            findUser = yield index_schema_1.User.findOneAndUpdate({ _id: userId }, { $set: { "multiFactorAuth": true } }, { new: true });
        }
        if (userType === 'staff' || userType === 'admin') {
            findUser = yield index_schema_1.Staff.findOneAndUpdate({ _id: userId }, { $set: { "multiFactorAuth": true } }, { new: true });
        }
    }
    (0, message_handler_1.returnMsg)(res, { MFAQrcode: tokenValidates, token: UserToken }, "Token validated successfuly");
});
exports.validateToken = validateToken;
// Returns true if the token matches
