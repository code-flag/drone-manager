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
exports.deleteFavorite = exports.getUserFavoriteProduct = exports.getUserFavoriteProductsPaginated = exports.addFavorite = void 0;
const error_1 = require("../helper/error");
const message_handler_1 = require("../helper/message-handler");
const index_schema_1 = require("../model/index.schema");
const addFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const favorite = yield index_schema_1.Favorite.findOne({ productId: data.productId, userId: data.userId });
    if (favorite) {
        throw new error_1.ConflictError("Product already added");
    }
    const saveToFavorite = yield index_schema_1.Favorite.create(data);
    if (!saveToFavorite) {
        throw new error_1.BadRequestError("Something went wrong, could not save Favorite product");
    }
    (0, message_handler_1.returnMsg)(res, saveToFavorite, "Product added successfully");
});
exports.addFavorite = addFavorite;
const getUserFavoriteProductsPaginated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    index_schema_1.Favorite.paginate(matchQuery, {
        populate: ["productId"],
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
            }, "Favorite product retrieved successfully");
        }
    });
});
exports.getUserFavoriteProductsPaginated = getUserFavoriteProductsPaginated;
const getUserFavoriteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { favoriteId } = req.params;
    const findFav = yield index_schema_1.Favorite.find({ userId: favoriteId }).populate(["productId"]);
    if (!findFav) {
        throw new error_1.NotFoundError("Favorite product not found");
    }
    (0, message_handler_1.returnMsg)(res, findFav, "Favorite product retrieved successfully");
});
exports.getUserFavoriteProduct = getUserFavoriteProduct;
const deleteFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { favoriteId } = req.params;
    const findFav = yield index_schema_1.Favorite.findOne({ _id: favoriteId });
    if (!findFav) {
        throw new error_1.NotFoundError("Favorite product not found");
    }
    const del = yield index_schema_1.Favorite.findByIdAndDelete({ _id: favoriteId });
    (0, message_handler_1.returnMsg)(res, [], "Favorite product deleted successfully");
});
exports.deleteFavorite = deleteFavorite;
