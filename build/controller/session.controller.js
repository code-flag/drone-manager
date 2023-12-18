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
exports.deleteCart = exports.getOneSession = exports.getManySession = void 0;
const index_schema_1 = require("../model/index.schema");
const error_1 = require("../helper/error");
const message_handler_1 = require("../helper/message-handler");
const getManySession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, offset = 0, userId, fromDate, toDate } = req.query;
    const matchQuery = { userId: userId };
    /** search dispute by date created */
    if (fromDate && toDate) {
        matchQuery["createdAt"] = {
            $gte: new Date(`${fromDate}`).toISOString(),
            $lt: new Date(`${toDate}`).toISOString(),
        };
    }
    index_schema_1.Session.paginate(matchQuery, {
        limit: limit,
        offset: offset,
        sort: {
            createdAt: -1,
            _id: 1,
        },
    }, (err, result) => {
        if (!err) {
            (0, message_handler_1.returnMsg)(res, {
                result: result.docs,
                totalCount: result.totalDocs,
            }, "User session added retrieved successfully");
        }
    });
});
exports.getManySession = getManySession;
const getOneSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionId } = req.query;
    const findSession = yield index_schema_1.Session.findOne({ _id: sessionId }).populate(["sessionId", "productId"]);
    if (!findSession) {
        throw new error_1.NotFoundError("User session added not found");
    }
    (0, message_handler_1.returnMsg)(res, findSession, "User session added retrieved successfully");
});
exports.getOneSession = getOneSession;
const deleteCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionId } = req.query;
    const findSession = yield index_schema_1.Session.findOne({ _id: sessionId });
    if (!findSession) {
        throw new error_1.NotFoundError("User session added not found");
    }
    const del = yield index_schema_1.Session.findByIdAndDelete({ _id: sessionId });
    (0, message_handler_1.returnMsg)(res, [], "User session added deleted successfully");
});
exports.deleteCart = deleteCart;
