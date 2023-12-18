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
exports.deleteReview = exports.getProductReview = exports.getOneReview = exports.getManyReview = exports.updateReview = exports.addReview = void 0;
const error_1 = require("../helper/error");
const message_handler_1 = require("../helper/message-handler");
const index_schema_1 = require("../model/index.schema");
const addReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const product = yield index_schema_1.Product.findOne({ _id: data.productId });
    if (product) {
        throw new error_1.ConflictError("Product does not exists");
    }
    const review = yield index_schema_1.Review.findOne({ productId: data.productId, userId: data.userId });
    if (review) {
        throw new error_1.ConflictError("Review already exists");
    }
    if (data.rating > 5) {
        throw new error_1.BadRequestError("Rating must be between 5 and 1 stars");
    }
    const saveReview = yield index_schema_1.Review.create(data);
    if (!saveReview) {
        throw new error_1.BadRequestError("Something went wrong, could not save Review");
    }
    const [star1, star2, star3, star4, star5] = yield Promise.all([
        index_schema_1.Review.count({ rating: 1 }),
        index_schema_1.Review.count({ rating: 2 }),
        index_schema_1.Review.count({ rating: 3 }),
        index_schema_1.Review.count({ rating: 4 }),
        index_schema_1.Review.count({ rating: 5 }),
    ]);
    const revw = star1 + star2 + star3 + star4 + star5;
    const rating = ((1 * star1) + (2 * star2) + (3 * star3) + (4 * star4) + (5 * star5)) / revw;
    try {
        yield index_schema_1.Product.findOneAndUpdate({ _id: data.productId }, {
            $set: { ratings: rating, reviews: revw }
        }, { new: true });
    }
    catch (error) {
        console.log("rating error", error === null || error === void 0 ? void 0 : error.message);
    }
    (0, message_handler_1.returnMsg)(res, saveReview, "Review added successfully");
});
exports.addReview = addReview;
const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    if (!reviewId) {
        throw new error_1.BadRequestError("Review id not provided");
    }
    const findCat = yield index_schema_1.Review.findOne({ _id: reviewId });
    if (!findCat) {
        throw new error_1.BadRequestError("Review not found");
    }
    const putReview = yield index_schema_1.Review.findByIdAndUpdate({ _id: reviewId }, {
        $set: req.body,
    });
    (0, message_handler_1.returnMsg)(res, putReview, "Review updated successfully");
});
exports.updateReview = updateReview;
const getManyReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, offset = 0, fromDate, toDate } = req.query;
    const queries = [
        "reviewId",
        "userId",
        "productId",
        "rating",
        "comment",
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
        if (element === "reviewId") {
            matchQuery["_id"] = req.query[element];
        }
        else {
            if (queries.includes(element)) {
                matchQuery[element] = req.query[element];
            }
        }
    });
    index_schema_1.Review.paginate(matchQuery, {
        populate: ['userId', 'productId'],
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
            }, "Review retrieved successfully");
        }
    });
});
exports.getManyReview = getManyReview;
const getOneReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.query;
    const findReview = yield index_schema_1.Review.findOne({ _id: reviewId }).populate(['userId', 'projectId']);
    if (!findReview) {
        throw new error_1.NotFoundError("Review not found");
    }
    (0, message_handler_1.returnMsg)(res, findReview, "Review retrieved successfully");
});
exports.getOneReview = getOneReview;
const getProductReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.query;
    const findReview = yield index_schema_1.Review.findOne({ productId: productId }).populate(['userId', 'projectId']);
    if (!findReview) {
        throw new error_1.NotFoundError("Review not found");
    }
    (0, message_handler_1.returnMsg)(res, findReview, "Review retrieved successfully");
});
exports.getProductReview = getProductReview;
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.query;
    const findReview = yield index_schema_1.Review.findOne({ _id: reviewId });
    if (!findReview) {
        throw new error_1.NotFoundError("Review not found");
    }
    const del = yield index_schema_1.Review.findByIdAndDelete({ _id: reviewId });
    (0, message_handler_1.returnMsg)(res, [], "Review deleted successfully");
});
exports.deleteReview = deleteReview;
