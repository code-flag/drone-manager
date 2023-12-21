"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncWrapper_1 = __importDefault(require("../middleware/asyncWrapper"));
const product_controller_1 = require("../controller/product.controller");
const router = (0, express_1.Router)();
router.post("/create", (0, asyncWrapper_1.default)(product_controller_1.addProduct));
router.put("/update/:productId", (0, asyncWrapper_1.default)(product_controller_1.updateProduct));
router.get("/all", (0, asyncWrapper_1.default)(product_controller_1.getManyProduct));
router.get("/:productId", (0, asyncWrapper_1.default)(product_controller_1.getOneProduct));
router.delete("/delete/:productId", (0, asyncWrapper_1.default)(product_controller_1.deleteProduct));
exports.default = router;
