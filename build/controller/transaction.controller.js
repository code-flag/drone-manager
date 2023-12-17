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
exports.updateTransactionStatus = exports.filterTransactions = exports.addTransaction = void 0;
const error_1 = require("../helper/error");
const message_handler_1 = require("../helper/message-handler");
const index_schema_1 = require("../model/index.schema");
const addTransaction = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.addTransaction = addTransaction;
const filterTransactions = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, offset = 0, 
    //   isActive = true,
    search, status, userId, orderId, transactionId, referenceId, category, fromDate, toDate, } = request.query;
    const matchQuery = {};
    if (status) {
        matchQuery["status"] = status;
    }
    if (userId) {
        matchQuery["userId"] = userId;
    }
    if (orderId) {
        matchQuery["orderId"] = orderId;
    }
    if (category) {
        matchQuery["OrderCategory"] = category;
    }
    if (transactionId) {
        matchQuery["_id"] = transactionId;
    }
    if (referenceId) {
        matchQuery["reference"] = referenceId;
    }
    if (search) {
        matchQuery["$or"] = [
            { regNo: { $regex: search, $options: "i" } },
            { fullName: { $regex: search, $options: "i" } },
            { reference: { $regex: search, $options: "i" } },
            { naration: { $regex: search, $options: "i" } },
            { OrganizationCategory: { $regex: search, $options: "i" } },
            { userId: { $regex: search, $options: "i" } },
            { orderId: { $regex: search, $options: "i" } },
            { reference: { $regex: search, $options: "i" } },
        ];
    }
    /** this help us to search student by date created or registered */
    if (fromDate && toDate) {
        matchQuery["createdAt"] = {
            $gte: new Date(`${fromDate}`).toISOString(),
            $lt: new Date(`${toDate}`).toISOString(),
        };
    }
    index_schema_1.Transactions.paginate(matchQuery, {
        populate: [
            {
                path: "orderId",
                select: "name logo tradename legalName industry category organizationCode isApproved",
            },
        ],
        limit: limit,
        offset: offset,
        sort: {
            createdAt: -1,
            _id: 1
        },
    }).then((txn) => {
        (0, message_handler_1.returnMsg)(response, {
            result: txn.docs,
            totalCount: txn.totalDocs,
        }, "Transactions retrieved successfully");
    });
});
exports.filterTransactions = filterTransactions;
const updateTransactionStatus = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { staff, admin } = request;
    const { id } = request.params;
    const txn = yield index_schema_1.Transactions.find({ _id: id });
    if (!txn) {
        throw new error_1.NotFoundError("Transaction does not exist");
    }
    const result = yield index_schema_1.Transactions.findOneAndUpdate({ _id: id }, {
        $set: { status: request.body.status },
    }, { new: true });
    if (result && staff) {
        const staffData = {
            staffId: staff._id,
            desc: "update user transaction",
            actionLevel: "2",
        };
        yield index_schema_1.Transactions.findOneAndUpdate({ _id: id }, {
            $addToSet: { update: staffData },
        }, { new: true });
    }
    (0, message_handler_1.returnMsg)(response, result, "Transactions status updated successfully");
});
exports.updateTransactionStatus = updateTransactionStatus;
