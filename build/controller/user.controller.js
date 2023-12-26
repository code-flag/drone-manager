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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.verifyRegConfirmationOTP = exports.verifyOTP = exports.generateOtp = exports.resendOtp = exports.updateUserInfo = exports.getUserByEmail = exports.getOneUser = exports.getAllUserCount = exports.getAllUser = exports.createUser = void 0;
const mailer_1 = require("../helper/mailer");
const error_1 = require("../helper/error");
const message_handler_1 = require("../helper/message-handler");
const index_schema_1 = require("../model/index.schema");
const otp_confirmation_message_1 = require("../helper/messages/otp-confirmation-message");
const reg_confirmation_1 = require("../helper/messages/reg-confirmation");
const generate_otp_1 = require("../helper/generate-otp");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    const findUser = yield index_schema_1.User.findOne({ email: userData.email });
    if (findUser) {
        throw new error_1.ConflictError("User already exist");
    }
    const otp = yield (0, generate_otp_1.generateOTP)();
    const otpTime = new Date();
    userData["otp"] = otp;
    userData["otpTime"] = otpTime;
    // create new user
    let newUser = yield index_schema_1.User.create(userData);
    if (!newUser) {
        throw new error_1.BadRequestError("Something went wrong");
    }
    try {
        const msgData = (0, reg_confirmation_1.regConfirmationMsg)({
            otp: otp,
            firstName: userData.userName,
        });
        const subject = "Email Confirmation";
        yield (0, mailer_1.sendMail)(userData.email, subject, msgData.message, msgData.attachment);
    }
    catch (error) {
        console.log("Could not send confirmation email");
    }
    newUser = newUser.toObject();
    delete newUser.otp;
    delete newUser.otpTime;
    delete newUser.password;
    try {
        yield index_schema_1.Shipping.create({ userId: newUser._id, phone: userData.phone, address: userData.address, email: userData.email });
    }
    catch (error) {
        console.log("could not save user contact to shipping database");
    }
    (0, message_handler_1.returnMsg)(res, { newUser }, "user created successfully");
});
exports.createUser = createUser;
const getAllUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, offset = 0, 
    //   isActive = true,
    isDeleted = false, isActive, search, email, fromDate, toDate, } = request.query;
    const matchQuery = {};
    if (email) {
        matchQuery["email"] = email;
    }
    if (isActive) {
        matchQuery["isActive"] = isActive;
    }
    if (search) {
        matchQuery["$or"] = [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }
    /** search for created or registered user */
    if (fromDate && toDate) {
        matchQuery["createdAt"] = {
            $gte: new Date(`${fromDate}`).toISOString(),
            $lt: new Date(`${toDate}`).toISOString(),
        };
    }
    index_schema_1.User.paginate(matchQuery, {
        limit: limit,
        offset: offset,
        sort: {
            createdAt: -1,
            _id: 1
        },
    }).then((user) => {
        return (0, message_handler_1.returnMsg)(response, {
            result: user.docs,
            totalCount: user.totalDocs,
        }, "Fetch all user data completed");
    });
});
exports.getAllUser = getAllUser;
const getAllUserCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUser = yield index_schema_1.User.count();
    if (!allUser) {
        throw new error_1.NotFoundError("No User was found");
    }
    (0, message_handler_1.returnMsg)(res, allUser, "All users retrieved successfully");
});
exports.getAllUserCount = getAllUserCount;
const getOneUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const user = yield index_schema_1.User.find({ _id: userId });
    if (!user) {
        throw new error_1.NotFoundError("user not found");
    }
    (0, message_handler_1.returnMsg)(res, user, "User retrieved successfully");
});
exports.getOneUser = getOneUser;
const getUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const user = yield index_schema_1.User.findOne({ email: email, isDeleted: false });
    if (!user) {
        throw new error_1.BadRequestError("User not found.");
    }
    return (0, message_handler_1.returnMsg)(res, user, "User retrieved successfully");
});
exports.getUserByEmail = getUserByEmail;
const updateUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    // check if user exist
    const user = yield index_schema_1.User.find({ _id: userId });
    if (!user) {
        throw new error_1.NotFoundError("user not found");
    }
    const dbResponse = yield index_schema_1.User.findOneAndUpdate({ _id: userId }, { $set: req.body }, { new: true });
    (0, message_handler_1.returnMsg)(res, dbResponse, "User data updated successfully");
});
exports.updateUserInfo = updateUserInfo;
const resendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const otp = yield (0, generate_otp_1.generateOTP)();
    const otpTime = new Date();
    const findUser = yield index_schema_1.User.findOne({
        _id: userId,
    });
    if (!findUser) {
        throw new error_1.ConflictError("User does not exist");
    }
    const updateUser = yield index_schema_1.User.findOneAndUpdate({ _id: userId }, {
        $set: { otp: otp, otpTime: otpTime },
    });
    if (!updateUser) {
        throw new error_1.BadRequestError("Something went wrong");
    }
    try {
        const msgData = (0, reg_confirmation_1.regConfirmationMsg)({
            otp: otp,
            firstName: findUser.userName,
        });
        const subject = "Email Confirmation OTP";
        yield (0, mailer_1.sendMail)(findUser.email, subject, msgData.message);
    }
    catch (error) {
        console.log("Could not send confirmation email");
    }
    (0, message_handler_1.returnMsg)(res, "", "Otp sent successfully");
});
exports.resendOtp = resendOtp;
const generateOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const otp = yield (0, generate_otp_1.generateOTP)();
    const otpTime = new Date();
    const findUser = yield index_schema_1.User.findOne({
        email: email,
    });
    if (!findUser) {
        throw new error_1.ConflictError("User does not exist");
    }
    const updateUser = yield index_schema_1.User.findOneAndUpdate({ email: email }, {
        $set: { otp: otp, otpTime: otpTime },
    });
    if (!updateUser) {
        throw new error_1.BadRequestError("Something went wrong");
    }
    try {
        const msgData = `Hi ${findUser.firstName},
      <p>Below is your One time Pin (OTP). It only valid for 15min. </p>

      <b> ${otp} </b>

      <p> Note: This pin should only be used directly by you and never to be reveal to anyone. Keep it safe.</p>
    
    `;
        const subject = "Huiospay OTP";
        yield (0, mailer_1.sendMail)(email, subject, msgData);
    }
    catch (error) {
        console.log("Could not send confirmation email");
    }
    (0, message_handler_1.returnMsg)(res, "", "Otp sent successfully");
});
exports.generateOtp = generateOtp;
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { otp, email } = req.query;
    const doc = yield index_schema_1.User.findOne({ email: email }, "+otp +otpTime");
    if (!doc) {
        throw new error_1.NotFoundError("User does not exist");
    }
    if (doc.otp !== otp) {
        throw new error_1.NotFoundError("Invalid OTP");
    }
    let timeNow = new Date();
    // get the time difference
    const duration = (timeNow.getTime() - ((_a = doc === null || doc === void 0 ? void 0 : doc.otpTime) === null || _a === void 0 ? void 0 : _a.getTime())) / 60000; // convert to minutes
    // check if the number is not greater than 15min
    if (duration > 15) {
        throw new error_1.BadRequestError("OTP has expired. Kindly request new otp.");
    }
    (0, message_handler_1.returnMsg)(res, "", "OTP confirmed");
});
exports.verifyOTP = verifyOTP;
const verifyRegConfirmationOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { otp, userId } = req.params;
    const doc = yield index_schema_1.User.findOne({ _id: userId }, "+otp +otpTime");
    if (!doc) {
        throw new error_1.NotFoundError("User does not exist");
    }
    if (doc.otp !== otp) {
        throw new error_1.NotFoundError("Invalid OTP");
    }
    let timeNow = new Date();
    // get the time difference
    const duration = (timeNow.getTime() - ((_b = doc === null || doc === void 0 ? void 0 : doc.otpTime) === null || _b === void 0 ? void 0 : _b.getTime())) / 60000; // convert to minutes
    // check if the number is not greater than 15min
    if (duration > 15) {
        throw new error_1.BadRequestError("OTP has expired. Kindly request new otp.");
    }
    yield index_schema_1.User.findOneAndUpdate({ _id: userId }, { $set: { isActive: true } });
    try {
        const subject = "Registration Completed";
        const html = (0, otp_confirmation_message_1.otpConfirmationMsg)({ name: doc.userName });
        yield (0, mailer_1.sendMail)(doc.email, subject, html.message, html.attachment);
    }
    catch (error) {
        console.log("Could not send confirmation email");
    }
    (0, message_handler_1.returnMsg)(res, "", "Registration confirmed");
});
exports.verifyRegConfirmationOTP = verifyRegConfirmationOTP;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const findUser = yield index_schema_1.User.findOne({
        _id: userId,
    });
    if (!findUser) {
        throw new error_1.NotFoundError("User not found");
    }
    const resp = yield index_schema_1.User.findOneAndRemove({
        _id: userId,
    });
    if (!resp) {
        throw new error_1.BadRequestError("Unable to delete User");
    }
    (0, message_handler_1.returnMsg)(res, "", "User deleted successfully");
});
exports.deleteUser = deleteUser;
