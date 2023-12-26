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
exports.accessKey = exports.loginUserWith2Fa = exports.confirmResetPassword = exports.askToResetPassword = exports.changePassword = exports.loginUser = void 0;
const error_1 = require("../helper/error");
const jwtAuth_1 = __importDefault(require("../helper/jwtAuth"));
const random_password_generator_1 = require("../helper/random-password-generator");
const mailer_1 = require("../helper/mailer");
const message_handler_1 = require("../helper/message-handler");
const index_schema_1 = require("../model/index.schema");
const crypto_js_1 = __importDefault(require("crypto-js"));
const dotenv_1 = __importDefault(require("dotenv"));
const hasher_1 = require("../helper/hasher");
const resetPasswordMsg_1 = require("../helper/messages/resetPasswordMsg");
const resetStaffPasswordMsg_1 = require("../helper/messages/resetStaffPasswordMsg");
const library_1 = require("../helper/library");
dotenv_1.default.config();
const loginUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, userType } = request.body;
    let user;
    let type = 0;
    if (userType == "user") {
        user = yield index_schema_1.User.findOne({ email: email }, "+password");
        type = 1;
    }
    if (userType == "staff") {
        user = yield index_schema_1.Staff.findOne({ email: email }, "+password");
        type = 3;
    }
    if (userType == "admin") {
        user = yield index_schema_1.Staff.findOne({ email: email, role: "admin" }, "+password");
        type = 4;
    }
    if (!user) {
        throw new error_1.BadRequestError("Email or password do not match.");
    }
    if (!user.isActive) {
        throw new error_1.BadRequestError("Account not activated.");
    }
    if (!user.validatePassword(password, user.password)) {
        throw new error_1.BadRequestError("Email or password do not match.");
    }
    let userProduct = {};
    if (user && userType === "user") {
        const favorites = yield index_schema_1.Favorite.find({ userId: user._id }).populate("productId");
        const carts = yield index_schema_1.Cart.find({ userId: user._id }).populate("productId");
        const orders = yield index_schema_1.Order.find({ userId: user._id, isActive: true });
        userProduct["carts"] = carts !== null && carts !== void 0 ? carts : [];
        userProduct["favorites"] = favorites !== null && favorites !== void 0 ? favorites : [];
        userProduct["orders"] = orders !== null && orders !== void 0 ? orders : [];
    }
    /**
     * _id and type does the same thing. _id is purposely used to confuse anyone that
     * may see the token data
     */
    let token = (0, jwtAuth_1.default)({
        id: user._id,
        _id: type,
        email: user.email,
    });
    // convert mongodb return data to normal javascript object
    user = user.toObject();
    if ((user === null || user === void 0 ? void 0 : user.multiFactorAuth) == true) {
        token = null;
    }
    delete user["otpAuthUrl"];
    delete user["secretBase"];
    delete user["password"];
    const useObject = Object.assign(Object.assign({}, user), userProduct);
    user = token == null ? { user: useObject } : { user: useObject, token };
    return (0, message_handler_1.returnMsg)(response, user, "success");
});
exports.loginUser = loginUser;
const changePassword = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, staff, organization, admin, token } = request;
    const { oldPassword, newPassword, confirmPassword } = request.body;
    let userInfo = {};
    if (token.type == "staff") {
        if (!staff.validatePassword(oldPassword, staff.password)) {
            throw new error_1.ConflictError("Old password is incorrect.");
        }
    }
    if (token.type == "admin") {
        if (!admin.validatePassword(oldPassword, staff.password)) {
            throw new error_1.ConflictError("Old password is incorrect.");
        }
    }
    if (token.type == "user") {
        if (!user.validatePassword(oldPassword, user.password)) {
            throw new error_1.ConflictError("Old password is incorrect.");
        }
    }
    if (token.type == "organization") {
        if (!organization.validatePassword(oldPassword, organization.password)) {
            throw new error_1.ConflictError("Old password is incorrect.");
        }
    }
    if (newPassword !== confirmPassword) {
        throw new error_1.ConflictError("Passwords do not match.");
    }
    if (token.type == "user") {
        const hashedPassword = yield (0, hasher_1.encryptPassword)(newPassword);
        yield index_schema_1.User.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            oneTimePassword: false,
        });
    }
    if (token.type == "staff" || token.type == "admin") {
        const hashedPassword = yield (0, hasher_1.encryptPassword)(newPassword);
        yield index_schema_1.Staff.findByIdAndUpdate(staff._id, {
            password: hashedPassword,
            oneTimePassword: false,
        });
    }
    //  await Activity.create({actorId: userInfo._id, actorRefPaths: user.ref, action: "change password", description: "password changed"})
    return response.status(200).json({
        status: "success",
        message: "Password updated successfully.",
    });
});
exports.changePassword = changePassword;
const askToResetPassword = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, userType } = request.body;
    let password;
    const expirationTime = Date.now();
    if (!userType) {
        throw new error_1.BadRequestError("User type is required!");
    }
    if (userType == "user") {
        const user = yield index_schema_1.User.findOne({ email: email });
        if (!user) {
            throw new error_1.NotFoundError("user not found.");
        }
        const passwordResetToken = {
            appName: "market-place-app",
            environment: process.env.NODE_ENV,
            id: user._id,
            expirationTime: expirationTime,
            userType: userType,
        };
        const token = crypto_js_1.default.AES.encrypt(JSON.stringify(passwordResetToken), "new-password").toString();
        const updateUserOtpDetails = yield index_schema_1.User.findOneAndUpdate({ _id: user._id }, { $set: { confirmationToken: token } }, { new: true });
        if (!updateUserOtpDetails) {
            throw new error_1.NotFoundError("Something went wrong");
        }
        try {
            const msgData = (0, resetPasswordMsg_1.resetPasswordMsg)({
                token,
                email,
            });
            const subject = "Password Reset";
            yield (0, mailer_1.sendMail)(email, subject, msgData.message, msgData.attachment);
        }
        catch (error) {
            console.log("Could not send email");
        }
    }
    if (userType == "staff" || userType == "admin") {
        const user = yield index_schema_1.Staff.findOne({ email: email }, "+password");
        if (!user) {
            throw new error_1.NotFoundError("Staff not found.");
        }
        const passwordResetToken = {
            appName: "market-place-app",
            environment: process.env.NODE_ENV,
            id: user.id,
            expirationTime,
            userType,
        };
        const token = crypto_js_1.default.AES.encrypt(JSON.stringify(passwordResetToken), "new-password").toString();
        const updateUserOtpDetails = yield index_schema_1.Staff.findOneAndUpdate({ _id: user.id }, { $set: { confirmationToken: token } }, { new: true });
        if (!updateUserOtpDetails) {
            throw new error_1.NotFoundError("Something went wrong");
        }
        try {
            const msgData = (0, resetStaffPasswordMsg_1.resetStaffPasswordMsg)({
                token,
                email,
            });
            const subject = "Password Reset";
            yield (0, mailer_1.sendMail)(email, subject, msgData.message, msgData.attachment);
        }
        catch (error) {
            console.log("Could not send email");
        }
    }
    (0, message_handler_1.returnMsg)(response, [], "A mail has been sent to your email to confirm Reset Password, kindly check your mail");
});
exports.askToResetPassword = askToResetPassword;
const confirmResetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { confirmationToken } = req.query;
    let password;
    try {
        confirmationToken = (0, library_1.strReplaceAll)(confirmationToken, "+");
    }
    catch (error) {
        console.log("strReplaceAll", error);
    }
    let doc;
    const bytes = crypto_js_1.default.AES.decrypt(confirmationToken, "new-password");
    const decryptedData = JSON.parse(bytes.toString(crypto_js_1.default.enc.Utf8));
    const userId = decryptedData === null || decryptedData === void 0 ? void 0 : decryptedData.id;
    const userType = decryptedData === null || decryptedData === void 0 ? void 0 : decryptedData.userType;
    if (!userType) {
        throw new error_1.BadRequestError("User type is required!");
    }
    if (userType == "user") {
        doc = yield index_schema_1.User.findOne({ _id: userId }).select("+confirmationToken");
        if (!doc) {
            throw new error_1.BadRequestError("Invalid confirmation token");
        }
        if (confirmationToken != doc.confirmationToken) {
            throw new error_1.BadRequestError("Invalid confirmation token");
        }
        try {
            // check if expired
            const currentTimestamp = Date.now();
            const timeBound = currentTimestamp - decryptedData.expirationTime;
            // seting it to 10 mins expiry time
            const expiryDuration = 10 * 60 * 1000;
            if (timeBound > expiryDuration) {
                throw new error_1.ConflictError("User token expired");
            }
            password = (0, random_password_generator_1.generateRandomPassword)(6);
            const hashedPassword = yield (0, hasher_1.encryptPassword)(password);
            yield index_schema_1.User.findOneAndUpdate({ _id: doc.id }, { $set: { password: hashedPassword, oneTimePassword: true } });
        }
        catch (error) {
            console.log("error ", error);
            throw new error_1.BadRequestError("Ooops! could not confirm User");
        }
    }
    if (userType == "staff" || userType == "admin") {
        doc = yield index_schema_1.Staff.findOne({ _id: userId }, "+confirmationToken");
        if (!doc) {
            throw new error_1.BadRequestError("Invalid confirmation token");
        }
        if (confirmationToken !== doc.confirmationToken) {
            throw new error_1.BadRequestError("Invalid confirmation token");
        }
        try {
            // check if expired
            const currentTimestamp = Date.now();
            const timeBound = currentTimestamp - decryptedData.expirationTime;
            // seting it to 10 mins expiry time
            const expiryDuration = 10 * 60 * 1000;
            if (timeBound > expiryDuration) {
                throw new error_1.ConflictError("Token expired");
            }
            password = (0, random_password_generator_1.generateRandomPassword)(6);
            const hashedPassword = yield (0, hasher_1.encryptPassword)(password);
            yield index_schema_1.Staff.findOneAndUpdate({ _id: doc.id }, { $set: { password: hashedPassword, oneTimePassword: true } });
        }
        catch (error) {
            throw new error_1.BadRequestError("Ooops! could not confirm Staff");
        }
    }
    console.log(doc);
    try {
        const subject = "Reset Password Completed";
        const html = `Dear ${doc.firstName}, your new Payslate account password is ${password}. Kindly change your password after logging in`;
        yield (0, mailer_1.sendMail)(doc === null || doc === void 0 ? void 0 : doc.email, subject, html);
    }
    catch (error) {
        console.log("Could not send confirmation email");
    }
    return;
    (0, message_handler_1.returnMsg)(res, "", "Password has been reset and the new password has been sent to your mail.");
});
exports.confirmResetPassword = confirmResetPassword;
/// login with 2FA activated
const loginUserWith2Fa = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, userType } = request.body;
    let user;
    let type = 0;
    if (userType == "user") {
        user = yield index_schema_1.User.findOne({ email: email }, "+password");
        type = 1;
    }
});
exports.loginUserWith2Fa = loginUserWith2Fa;
const accessKey = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tokenData = {
        appName: "market-place-app",
        environment: process.env.NODE_ENV,
        lock: Date.now(),
    };
    const newToken = crypto_js_1.default.AES.encrypt(JSON.stringify(tokenData), (_a = process.env.ACCESS_SEC_KEY) !== null && _a !== void 0 ? _a : "").toString();
    return (0, message_handler_1.returnMsg)(response, newToken, "");
});
exports.accessKey = accessKey;
