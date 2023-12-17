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
exports.deleteCategory = exports.getOneCategory = exports.getManyCategory = exports.updateCategory = exports.addCategory = void 0;
const error_1 = require("../helper/error");
const message_handler_1 = require("../helper/message-handler");
const index_schema_1 = require("../model/index.schema");
const addCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const category = yield index_schema_1.Category.findOne({ name: data.name });
    if (category) {
        throw new error_1.ConflictError("Category already exists");
    }
    const saveCategory = yield index_schema_1.Category.create(data);
    if (!saveCategory) {
        throw new error_1.BadRequestError("Something went wrong, could not save Category");
    }
    (0, message_handler_1.returnMsg)(res, saveCategory, "Category added successfully");
});
exports.addCategory = addCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    if (!categoryId) {
        throw new error_1.BadRequestError("Category id not provided");
    }
    const findCat = yield index_schema_1.Category.findOne({ _id: categoryId });
    if (!findCat) {
        throw new error_1.BadRequestError("Category not found");
    }
    const putCategory = yield index_schema_1.Category.findByIdAndUpdate({ _id: categoryId }, {
        $set: req.body,
    });
    (0, message_handler_1.returnMsg)(res, putCategory, "Category updated successfully");
});
exports.updateCategory = updateCategory;
const getManyCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, offset = 0, fromDate, toDate } = req.query;
    const queries = [
        "categoryId",
        "name",
        "parentId",
        "desc",
        "parentName",
        "image",
        "type",
        "search"
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
        if (element === "categoryId") {
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
    index_schema_1.Category.paginate(matchQuery, {
        populate: [{ path: 'parentId' }],
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
            }, "Category retrieved successfully");
        }
    });
});
exports.getManyCategory = getManyCategory;
const getOneCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.query;
    const findCategory = yield index_schema_1.Category.findOne({ _id: categoryId }).populate("parentId");
    if (!findCategory) {
        throw new error_1.NotFoundError("Category not found");
    }
    (0, message_handler_1.returnMsg)(res, categoryId, "Category retrieved successfully");
});
exports.getOneCategory = getOneCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.query;
    const findCategory = yield index_schema_1.Category.findOne({ _id: categoryId });
    if (!findCategory) {
        throw new error_1.NotFoundError("Category not found");
    }
    const del = yield index_schema_1.Category.findByIdAndDelete({ _id: categoryId });
    (0, message_handler_1.returnMsg)(res, [], "Category deleted successfully");
});
exports.deleteCategory = deleteCategory;
