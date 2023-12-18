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
exports.userAndTransactionRecord = void 0;
const message_handler_1 = require("../helper/message-handler");
const index_schema_1 = require("../model/index.schema");
const library_1 = require("../helper/library");
const userAndTransactionRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [totalUser, totalActiveUser, totalOrder, totalProduct, totalTransactions, totalActiveDispute] = yield Promise.all([
        index_schema_1.User.count(),
        index_schema_1.User.count({ isActive: true }),
        index_schema_1.Order.count(),
        index_schema_1.Product.count({ isApproved: true }),
        index_schema_1.Transactions.find(),
        index_schema_1.Dispute.count(),
        index_schema_1.Dispute.count({ status: true })
    ]);
    const txn = (0, library_1.getUserAddedPerMonth)(totalTransactions);
    (0, message_handler_1.returnMsg)(res, {
        totalUser: totalUser,
        totalActiveUser: totalActiveUser,
        totalOrder: totalOrder,
        totalProduct: totalProduct,
        totalTransactions: totalTransactions.length,
        Transactions: txn,
        totalActiveDispute: totalActiveDispute,
    }, "data retrieved successfully");
});
exports.userAndTransactionRecord = userAndTransactionRecord;
