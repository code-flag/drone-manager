"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncWrapper_1 = __importDefault(require("../middleware/asyncWrapper"));
const category_controller_1 = require("../controller/category.controller");
const router = (0, express_1.Router)();
router.post("/create", (0, asyncWrapper_1.default)(category_controller_1.addCategory));
router.put("/update/:categoryId", (0, asyncWrapper_1.default)(category_controller_1.updateCategory));
router.get("/all", (0, asyncWrapper_1.default)(category_controller_1.getManyCategory));
router.get("/type/:type", (0, asyncWrapper_1.default)(category_controller_1.getCategoryByType));
router.get("/:categoryId", (0, asyncWrapper_1.default)(category_controller_1.getOneCategory));
router.delete("/delete/:categoryId", (0, asyncWrapper_1.default)(category_controller_1.deleteCategory));
exports.default = router;
