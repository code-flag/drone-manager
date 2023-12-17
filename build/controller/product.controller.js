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
exports.deleteProduct = exports.getOneProduct = exports.getManyProduct = exports.updateProductTags = exports.updateProduct = exports.addProduct = void 0;
const error_1 = require("../helper/error");
const message_handler_1 = require("../helper/message-handler");
const index_schema_1 = require("../model/index.schema");
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = req.body;
    const findProductByName = yield index_schema_1.Product.findOne({ name: product.name });
    if (findProductByName) {
        throw new error_1.ConflictError("Product already exists");
    }
    const saveProduct = yield index_schema_1.Product.create(product);
    if (!saveProduct) {
        throw new error_1.BadRequestError("Something went wrong, could not save product");
    }
    (0, message_handler_1.returnMsg)(res, saveProduct, "Product added successfully");
});
exports.addProduct = addProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    if (!productId) {
        throw new error_1.BadRequestError("Product id not provided");
    }
    const findProduct = yield index_schema_1.Product.findOne({ _id: productId });
    if (!findProduct) {
        throw new error_1.BadRequestError("Product not found");
    }
    const putProduct = yield index_schema_1.Product.findByIdAndUpdate({ _id: productId }, {
        $set: req.body,
    });
    (0, message_handler_1.returnMsg)(res, putProduct, "Product updated successfully");
});
exports.updateProduct = updateProduct;
const updateProductTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    if (!productId) {
        throw new error_1.BadRequestError("Product id not provided");
    }
    const findProduct = yield index_schema_1.Product.findOne({ _id: productId });
    if (!findProduct) {
        throw new error_1.BadRequestError("Product not found");
    }
    let newTags = [];
    if (Array.isArray(req.body.tags)) {
        const tags = req.body.tags;
        newTags = tags.concat(findProduct.tags);
    }
    const putProduct = yield index_schema_1.Product.findByIdAndUpdate({ _id: productId }, {
        $addToSet: { tags: newTags },
    });
    (0, message_handler_1.returnMsg)(res, putProduct, "Product tags updated successfully");
});
exports.updateProductTags = updateProductTags;
const getManyProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, offset = 0, fromDate, toDate } = req.query;
    const queries = [
        "productId",
        "name",
        "reviews",
        "rating",
        "tags",
        "basePrice",
        "discountPrice",
        "discountPercentage",
        "desc",
        "categoryId",
        "subCategoryId",
        "search",
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
        if (element === "productId") {
            matchQuery["_id"] = req.query[element];
        }
        else if (element === "tags") {
            matchQuery["tags"] = { $all: [req.query[element]] };
        }
        else if (element === "search") {
            matchQuery["$or"] = [
                { name: { $regex: req.query.search, $options: "i" } },
                { tags: { $regex: req.query.search, $options: "i" } },
                { desc: { $regex: req.query.search, $options: "i" } },
            ];
        }
        else {
            if (queries.includes(element)) {
                matchQuery[element] = req.query[element];
            }
        }
    });
    index_schema_1.Product.paginate(matchQuery, {
        populate: [],
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
            }, "Product retrieved successfully");
        }
    });
});
exports.getManyProduct = getManyProduct;
const getOneProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.query;
    const findProduct = yield index_schema_1.Product.findOne({ _id: productId });
    if (!findProduct) {
        throw new error_1.NotFoundError("Product not found");
    }
    (0, message_handler_1.returnMsg)(res, productId, "Product retrieved successfully");
});
exports.getOneProduct = getOneProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.query;
    const findProduct = yield index_schema_1.Product.findOne({ _id: productId });
    if (!findProduct) {
        throw new error_1.NotFoundError("Product not found");
    }
    const del = yield index_schema_1.Product.findByIdAndDelete({ _id: productId });
    (0, message_handler_1.returnMsg)(res, [], "Product deleted successfully");
});
exports.deleteProduct = deleteProduct;
