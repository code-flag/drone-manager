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
exports.deleteCart = exports.getOneCart = exports.getUserCartPaginated = exports.addCart = void 0;
const error_1 = require("../helper/error");
const message_handler_1 = require("../helper/message-handler");
const index_schema_1 = require("../model/index.schema");
const addCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const cart = yield index_schema_1.Cart.findOne({ name: data.productId });
    if (cart) {
        throw new error_1.ConflictError("Product already added");
    }
    const saveToCart = yield index_schema_1.Cart.create(data);
    if (!saveToCart) {
        throw new error_1.BadRequestError("Something went wrong, could not save Cart product");
    }
    (0, message_handler_1.returnMsg)(res, saveToCart, "Product added successfully");
});
exports.addCart = addCart;
const getUserCartPaginated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, offset = 0, fromDate, toDate } = req.query;
    const queries = [
        "productId",
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
    index_schema_1.Cart.paginate(matchQuery, {
        populate: ["userId", "productId"],
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
            }, "Cart product retrieved successfully");
        }
    });
});
exports.getUserCartPaginated = getUserCartPaginated;
const getOneCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const findCart = yield index_schema_1.Cart.findOne({ userId: userId }).populate(["userId", "productId"]);
    if (!findCart) {
        throw new error_1.NotFoundError("Cart product not found");
    }
    (0, message_handler_1.returnMsg)(res, findCart, "Cart product retrieved successfully");
});
exports.getOneCart = getOneCart;
const deleteCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartId } = req.params;
    const findCart = yield index_schema_1.Cart.findOne({ _id: cartId });
    if (!findCart) {
        throw new error_1.NotFoundError("Cart product not found");
    }
    const del = yield index_schema_1.Cart.findByIdAndDelete({ _id: cartId });
    (0, message_handler_1.returnMsg)(res, [], "Cart product deleted successfully");
});
exports.deleteCart = deleteCart;
