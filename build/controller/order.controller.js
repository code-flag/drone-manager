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
exports.deleteOrder = exports.getOneOrder = exports.getManyOrder = exports.updateOrder = exports.addOrder = void 0;
const error_1 = require("../helper/error");
const message_handler_1 = require("../helper/message-handler");
const index_schema_1 = require("../model/index.schema");
const addOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const order = yield index_schema_1.Order.findOne({ productId: data.productId });
    if (order) {
        throw new error_1.ConflictError("Product order already exists");
    }
    const saveOrder = yield index_schema_1.Order.create(data);
    if (!saveOrder) {
        throw new error_1.BadRequestError("Something went wrong, could not save Order");
    }
    (0, message_handler_1.returnMsg)(res, saveOrder, "Product order added successfully");
});
exports.addOrder = addOrder;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    if (!orderId) {
        throw new error_1.BadRequestError("Product order id not provided");
    }
    const findOrder = yield index_schema_1.Order.findOne({ _id: orderId });
    if (!findOrder) {
        throw new error_1.BadRequestError("Product order not found");
    }
    const putOrder = yield index_schema_1.Order.findByIdAndUpdate({ _id: orderId }, {
        $set: req.body,
    });
    (0, message_handler_1.returnMsg)(res, putOrder, "Product order updated successfully");
});
exports.updateOrder = updateOrder;
const getManyOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, offset = 0, fromDate, toDate } = req.query;
    const queries = [
        "orderId",
        "shippingId",
        "productId",
        "userId",
        "paymentChannel",
        "transactionId",
        "paymentStatus",
        "status",
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
        if (element === "orderId") {
            matchQuery["_id"] = req.query[element];
        }
        else if (element === "search") {
            matchQuery["$or"] = [
                { name: { $regex: req.query.search, $options: "i" } },
                { desc: { $regex: req.query.search, $options: "i" } },
            ];
        }
        else {
            if (queries.includes(element)) {
                matchQuery[element] = req.query[element];
            }
        }
    });
    index_schema_1.Order.paginate(matchQuery, {
        populate: [{ path: 'userId' }, { path: "productId" }],
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
            }, "Product order retrieved successfully");
        }
    });
});
exports.getManyOrder = getManyOrder;
const getOneOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.query;
    const findOrder = yield index_schema_1.Order.findOne({ _id: orderId });
    if (!findOrder) {
        throw new error_1.NotFoundError("Product order not found");
    }
    (0, message_handler_1.returnMsg)(res, findOrder, "Product order retrieved successfully");
});
exports.getOneOrder = getOneOrder;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.query;
    const findOrder = yield index_schema_1.Order.findOne({ _id: orderId });
    if (!findOrder) {
        throw new error_1.NotFoundError("Product order not found");
    }
    const del = yield index_schema_1.Order.findByIdAndDelete({ _id: orderId });
    (0, message_handler_1.returnMsg)(res, [], "Product order deleted successfully");
});
exports.deleteOrder = deleteOrder;
