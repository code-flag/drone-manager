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
exports.deleteShipping = exports.getOneShipping = exports.getManyShipping = exports.addShipping = void 0;
const index_schema_1 = require("../model/index.schema");
const error_1 = require("../helper/error");
const message_handler_1 = require("../helper/message-handler");
const addShipping = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const saveToShipping = yield index_schema_1.Shipping.create(data);
    if (!saveToShipping) {
        throw new error_1.BadRequestError("Something went wrong, could not save Shipping");
    }
    (0, message_handler_1.returnMsg)(res, saveToShipping, "shipping info added successfully");
});
exports.addShipping = addShipping;
const getManyShipping = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, offset = 0, fromDate, toDate } = req.query;
    const queries = [
        "shippingId",
        "userId",
    ];
    const matchQuery = {};
    /** search dispute by date created */
    if (fromDate && toDate) {
        matchQuery["createdAt"] = {
            $gte: new Date(`${fromDate}`).toISOString(),
            $lt: new Date(`${toDate}`).toISOString(),
        };
    }
    Object.keys(req.query).forEach((element) => {
        if (queries.includes(element)) {
            matchQuery[element] = req.query[element];
        }
    });
    index_schema_1.Shipping.paginate(matchQuery, {
        populate: ["userId"],
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
            }, "Shipping retrieved successfully");
        }
    });
});
exports.getManyShipping = getManyShipping;
const getOneShipping = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shippingId } = req.query;
    const findShipping = yield index_schema_1.Shipping.findOne({ _id: shippingId }).populate(["userId", "shippingId"]);
    if (!findShipping) {
        throw new error_1.NotFoundError("Shipping not found");
    }
    (0, message_handler_1.returnMsg)(res, findShipping, "Shipping retrieved successfully");
});
exports.getOneShipping = getOneShipping;
const deleteShipping = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shippingId } = req.query;
    const findShipping = yield index_schema_1.Shipping.findOne({ _id: shippingId });
    if (!findShipping) {
        throw new error_1.NotFoundError("Shipping not found");
    }
    const del = yield index_schema_1.Shipping.findByIdAndDelete({ _id: shippingId });
    (0, message_handler_1.returnMsg)(res, [], "Shipping deleted successfully");
});
exports.deleteShipping = deleteShipping;
