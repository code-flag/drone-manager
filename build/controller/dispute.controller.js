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
exports.adminResolution = exports.getAllDisputes = exports.getDisputeByUserId = exports.getDisputeByTicketId = exports.createDispute = void 0;
const error_1 = require("../helper/error");
const message_handler_1 = require("../helper/message-handler");
const mailer_1 = require("../helper/mailer");
const unique_id_1 = require("../helper/unique-id");
const dispute_schema_1 = __importDefault(require("../model/schemas/dispute.schema"));
const index_schema_1 = require("../model/index.schema");
const createDispute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const disputeData = req.body;
    if (!disputeData.userType) {
        throw new error_1.BadRequestError("User type must be specified");
    }
    const ticketId = yield (0, unique_id_1.generateDisputeTicketID)();
    let existingOrder;
    // Check if order id matches any order id in Order collection
    try {
        existingOrder = yield index_schema_1.Order.findOne({
            _id: disputeData === null || disputeData === void 0 ? void 0 : disputeData.trx_reference,
        }).populate([
            { path: "userId", select: "firstName lastName email avatar" },
            { path: "productId", select: "category subCategory" },
        ]);
    }
    catch (error) {
        console.log("error ", error);
        throw new error_1.BadRequestError("Invalid Order id");
    }
    if (!existingOrder) {
        throw new error_1.BadRequestError("Order not found for the given trx_reference");
    }
    const userName = `${(_a = existingOrder === null || existingOrder === void 0 ? void 0 : existingOrder.userId) === null || _a === void 0 ? void 0 : _a.firstName} ${existingOrder === null || existingOrder === void 0 ? void 0 : existingOrder.userId.lastName}`;
    const userId = (_b = existingOrder === null || existingOrder === void 0 ? void 0 : existingOrder.userId) === null || _b === void 0 ? void 0 : _b._id;
    const email = (_c = existingOrder === null || existingOrder === void 0 ? void 0 : existingOrder.userId) === null || _c === void 0 ? void 0 : _c.email;
    const insertData = {
        userId: userId,
        disputeTicketId: "MP" + ticketId,
        description: disputeData.description,
        disputeCategory: (_d = existingOrder.subCategoryId) !== null && _d !== void 0 ? _d : existingOrder.categoryId,
        userName: userName,
        orderId: disputeData.orderId,
        email: email,
        image: (_e = disputeData === null || disputeData === void 0 ? void 0 : disputeData.avatar) !== null && _e !== void 0 ? _e : null,
    };
    // Create new Dispute
    let newDispute = yield dispute_schema_1.default.create(insertData);
    if (!newDispute) {
        throw new error_1.BadRequestError("Oops!! Something went wrong");
    }
    // send dispute notification email
    try {
        const subject = "Dispute Email Confirmation (Market Place)";
        const msg = `Dear Esteemed Customer, 
      <p>We have received your dispute request our support team will begin looking into it and resolve as soon as possible. 
      Your dispute ticketID is <b> ${newDispute.disputeTicketId} </b>. 
      Please feel free to use this code to track your complain and get status.</p>
      <p> Thank you for choosing Market Place</p>`;
        yield (0, mailer_1.sendMail)(newDispute.email, subject, msg);
    }
    catch (error) {
        console.log("Could not send dispute confirmation email");
    }
    return (0, message_handler_1.returnMsg)(res, { newDispute }, "New dispute created successfully");
});
exports.createDispute = createDispute;
// get dispute by ticketId
const getDisputeByTicketId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { disputeTicketId } = req.params;
    const dispute = yield dispute_schema_1.default.findOne({ disputeTicketId: disputeTicketId });
    if (!dispute) {
        throw new error_1.NotFoundError("Dispute with this ID not found");
    }
    return (0, message_handler_1.returnMsg)(res, dispute, "Dispute retrieved successfully");
});
exports.getDisputeByTicketId = getDisputeByTicketId;
// get dispute by userId
const getDisputeByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const getUserId = yield dispute_schema_1.default.findOne({ userId: userId });
    if (!getUserId) {
        throw new error_1.NotFoundError("Dispute with this userID not found");
    }
    return (0, message_handler_1.returnMsg)(res, getUserId, "User with Dispute retrieved successfully");
});
exports.getDisputeByUserId = getDisputeByUserId;
const getAllDisputes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, offset = 0, status, resolveComment, search, disputeTicketId, email, fromDate, toDate, userId, productCategoryId, orderId, } = req.query;
    const matchQuery = {};
    if (email) {
        matchQuery["email"] = email;
    }
    if (userId) {
        matchQuery["userId"] = userId;
    }
    if (productCategoryId) {
        matchQuery["productCategoryId"] = productCategoryId;
    }
    if (status) {
        matchQuery["status"] = status;
    }
    if (resolveComment) {
        matchQuery["resolveComment"] = resolveComment;
    }
    if (disputeTicketId) {
        matchQuery["disputeTicketId"] = disputeTicketId;
    }
    if (orderId) {
        matchQuery["orderId"] = orderId;
    }
    /** search dispute by date created */
    if (fromDate && toDate) {
        matchQuery["createdAt"] = {
            $gte: new Date(`${fromDate}`).toISOString(),
            $lt: new Date(`${toDate}`).toISOString(),
        };
    }
    if (search) {
        matchQuery["$or"] = [
            { disputeTicketId: { $regex: search, $options: "i" } },
        ];
    }
    dispute_schema_1.default.paginate(matchQuery, {
        populate: ["orderId.userId", "orderId.productId"],
        limit: limit,
        offset: offset,
        sort: {
            _id: 1,
            createdAt: 1,
        },
    }).then((dispute) => {
        return (0, message_handler_1.returnMsg)(res, {
            result: dispute.docs,
            totalCount: dispute.totalDocs,
        }, "Fetched all unresolved dispute data completed");
    });
});
exports.getAllDisputes = getAllDisputes;
const adminResolution = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { staff, admin } = req;
    let staffData = staff !== null && staff !== void 0 ? staff : admin;
    const { resolveComment, disputeTicketId } = req.body;
    if (!resolveComment || resolveComment == "") {
        throw new error_1.BadRequestError("resolve comment is required!");
    }
    const findTrxRef = yield dispute_schema_1.default.findOne({
        disputeTicketId: disputeTicketId,
    });
    if (!findTrxRef) {
        throw new error_1.NotFoundError("No dispute found");
    }
    let newStatus = null;
    if (staffData) {
        staffData = {
            staffId: staffData._id,
            actionLevel: 5,
            desc: "Attended to dispute",
        };
        newStatus = yield dispute_schema_1.default.findOneAndUpdate({ disputeTicketId: disputeTicketId }, {
            $set: { resolveComment: resolveComment, status: true },
            $addToSet: { updatedBy: staffData },
        }, { new: true });
    }
    else {
        newStatus = yield dispute_schema_1.default.findOneAndUpdate({ disputeTicketId: disputeTicketId }, { $set: { resolveComment: resolveComment, status: true } }, { new: true });
    }
    if (!newStatus) {
        throw new error_1.BadRequestError("Failed to update dispute status");
    }
    (0, message_handler_1.returnMsg)(res, newStatus, "Dispute is resolved successfully");
});
exports.adminResolution = adminResolution;
