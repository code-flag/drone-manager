"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const asyncWrapper_1 = __importDefault(require("../middleware/asyncWrapper"));
const order_controller_1 = require("../controller/order.controller");
const router = (0, express_1.Router)();
router.post("/create", auth_1.verifyAccessKey, auth_1.verifyToken, (0, asyncWrapper_1.default)(order_controller_1.addOrder));
router.put("/update/:orderId", auth_1.verifyAccessKey, auth_1.verifyToken, (0, asyncWrapper_1.default)(order_controller_1.updateOrder));
router.get("/all", auth_1.verifyAccessKey, auth_1.verifyToken, (0, asyncWrapper_1.default)(order_controller_1.getManyOrder));
router.get("/:orderId", auth_1.verifyAccessKey, auth_1.verifyToken, (0, asyncWrapper_1.default)(order_controller_1.getOneOrder));
router.delete("/delete/:orderId", auth_1.verifyAccessKey, auth_1.verifyToken, (0, asyncWrapper_1.default)(order_controller_1.deleteOrder));
exports.default = router;
