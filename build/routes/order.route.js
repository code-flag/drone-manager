"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncWrapper_1 = __importDefault(require("../middleware/asyncWrapper"));
const order_controller_1 = require("../controller/order.controller");
const router = (0, express_1.Router)();
router.post("/create", 
// verifyAccessKey,
// verifyToken,
(0, asyncWrapper_1.default)(order_controller_1.addOrder));
router.put("/update/:orderId", 
// verifyAccessKey,
// verifyToken,
(0, asyncWrapper_1.default)(order_controller_1.updateOrder));
router.get("/all", 
// verifyAccessKey,
// verifyToken,
(0, asyncWrapper_1.default)(order_controller_1.getManyOrder));
router.get("/:orderId", 
// verifyAccessKey,
// verifyToken,
(0, asyncWrapper_1.default)(order_controller_1.getOneOrder));
router.delete("/delete/:orderId", 
// verifyAccessKey,
// verifyToken,
(0, asyncWrapper_1.default)(order_controller_1.deleteOrder));
exports.default = router;
