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
exports.deleteStaff = exports.verifyRegConfirmationOTP = exports.verifyOTP = exports.generateOtp = exports.resendOtp = exports.updateStaffInfo = exports.updateStaffSocialMedia = exports.getOneStaff = exports.getAllStaffCount = exports.getAllStaff = exports.createStaff = void 0;
const index_schema_1 = require("../model/index.schema");
const error_1 = require("../helper/error");
const message_handler_1 = require("../helper/message-handler");
const reg_confirmation_1 = require("../helper/messages/reg-confirmation");
const mailer_1 = require("../helper/mailer");
const generate_otp_1 = require("../helper/generate-otp");
const otp_confirmation_message_1 = require("../helper/messages/otp-confirmation-message");
const createStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const staffData = req.body;
    const findStaff = yield index_schema_1.Staff.findOne({ email: staffData.email });
    if (findStaff) {
        throw new error_1.ConflictError("Staff already exist");
    }
    const otp = yield (0, generate_otp_1.generateOTP)();
    const otpTime = new Date();
    staffData["otp"] = otp;
    staffData["otpTime"] = otpTime;
    // create new staff
    let newStaff = yield index_schema_1.Staff.create(staffData);
    if (!newStaff) {
        throw new error_1.BadRequestError("Something went wrong");
    }
    try {
        const msgData = (0, reg_confirmation_1.regConfirmationMsg)({
            otp: otp,
            firstName: staffData.firstName,
        });
        const subject = "Email Confirmation";
        yield (0, mailer_1.sendMail)(staffData.email, subject, msgData.message, msgData.attachment);
    }
    catch (error) {
        console.log("Could not send confirmation email");
    }
    newStaff = newStaff.toObject();
    delete newStaff.otp;
    delete newStaff.otpTime;
    delete newStaff.password;
    (0, message_handler_1.returnMsg)(res, newStaff, "Staff created successfully");
});
exports.createStaff = createStaff;
const getAllStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allStaff = yield index_schema_1.Staff.find();
    if (!allStaff) {
        throw new error_1.NotFoundError("No staff was found");
    }
    (0, message_handler_1.returnMsg)(res, allStaff, "All staffs retrieved successfully");
});
exports.getAllStaff = getAllStaff;
const getAllStaffCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allStaff = yield index_schema_1.Staff.count();
    if (!allStaff) {
        throw new error_1.NotFoundError("No staff was found");
    }
    (0, message_handler_1.returnMsg)(res, allStaff, "All staffs retrieved successfully");
});
exports.getAllStaffCount = getAllStaffCount;
const getOneStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { staffId } = req.params;
    const staff = yield index_schema_1.Staff.find({ _id: staffId });
    if (!staff) {
        throw new error_1.NotFoundError("staff not found");
    }
    (0, message_handler_1.returnMsg)(res, staff, "Staffs retrieved successfully");
});
exports.getOneStaff = getOneStaff;
const updateStaffSocialMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { staffId } = req.params;
    // check if user exist
    const staff = yield index_schema_1.Staff.find({ _id: staffId });
    if (!staff) {
        throw new error_1.NotFoundError("staff not found");
    }
    const dbResponse = yield index_schema_1.Staff.findOneAndUpdate({ _id: staffId }, { $addToSet: { socialMedia: req.body } }, { new: true });
    (0, message_handler_1.returnMsg)(res, dbResponse, "Staff social media account added successfully");
});
exports.updateStaffSocialMedia = updateStaffSocialMedia;
const updateStaffInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { staffId } = req.params;
    // check if user exist
    const staff = yield index_schema_1.Staff.find({ _id: staffId });
    if (!staff) {
        throw new error_1.NotFoundError("staff not found");
    }
    const dbResponse = yield index_schema_1.Staff.findOneAndUpdate({ _id: staffId }, { $set: req.body }, { new: true });
    (0, message_handler_1.returnMsg)(res, dbResponse, "Staff data updated successfully");
});
exports.updateStaffInfo = updateStaffInfo;
const resendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { staffId } = req.params;
    const otp = yield (0, generate_otp_1.generateOTP)();
    const otpTime = new Date();
    const findStaff = yield index_schema_1.Staff.findOne({
        _id: staffId,
    });
    if (!findStaff) {
        throw new error_1.ConflictError("User does not exist");
    }
    const updateUser = yield index_schema_1.Staff.findOneAndUpdate({ _id: staffId }, {
        $set: { otp: otp, otpTime: otpTime },
    });
    if (!updateUser) {
        throw new error_1.BadRequestError("Something went wrong");
    }
    try {
        const msgData = (0, reg_confirmation_1.regConfirmationMsg)({
            otp: otp,
            firstName: findStaff.userName,
        });
        const subject = "Email Confirmation OTP";
        yield (0, mailer_1.sendMail)(findStaff.email, subject, msgData.message, msgData.attachment);
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
    const findStaff = yield index_schema_1.Staff.findOne({
        email: email,
    });
    if (!findStaff) {
        throw new error_1.ConflictError("User does not exist");
    }
    const updateUser = yield index_schema_1.Staff.findOneAndUpdate({ email: email }, {
        $set: { otp: otp, otpTime: otpTime },
    });
    if (!updateUser) {
        throw new error_1.BadRequestError("Something went wrong");
    }
    try {
        const msgData = `Hi ${findStaff.firstName},
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
    const doc = yield index_schema_1.Staff.findOne({ email: email }, "+otp +otpTime");
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
    const { otp, staffId } = req.params;
    const doc = yield index_schema_1.Staff.findOne({ _id: staffId }, "+otp +otpTime");
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
    yield index_schema_1.Staff.findOneAndUpdate({ _id: staffId }, { $set: { isActive: true } });
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
const deleteStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { staffId } = req.params;
    const findStaff = yield index_schema_1.Staff.findOne({
        _id: staffId,
    });
    if (!findStaff) {
        throw new error_1.NotFoundError("User not found");
    }
    const resp = yield index_schema_1.Staff.findOneAndRemove({
        _id: staffId,
    });
    if (!resp) {
        throw new error_1.BadRequestError("Unable to delete User");
    }
    (0, message_handler_1.returnMsg)(res, "", "User deleted successfully");
});
exports.deleteStaff = deleteStaff;
