"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncWrapper_1 = __importDefault(require("../middleware/asyncWrapper"));
const cart_controller_1 = require("../controller/cart.controller");
const router = (0, express_1.Router)();
router.post("/create", (0, asyncWrapper_1.default)(cart_controller_1.addCart));
router.get("/user/:cartId", (0, asyncWrapper_1.default)(cart_controller_1.getOneCart));
router.get("/all", (0, asyncWrapper_1.default)(cart_controller_1.getUserCartPaginated));
router.delete("/delete/:cartId", (0, asyncWrapper_1.default)(cart_controller_1.deleteCart));
exports.default = router;
