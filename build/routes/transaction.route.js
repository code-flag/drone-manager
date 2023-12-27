"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncWrapper_1 = __importDefault(require("../middleware/asyncWrapper"));
const transaction_controller_1 = require("../controller/transaction.controller");
const router = (0, express_1.Router)();
router.post("/create", (0, asyncWrapper_1.default)(transaction_controller_1.addTransaction));
router.put("/update/:transactionId", (0, asyncWrapper_1.default)(transaction_controller_1.updateTransactionStatus));
router.get("/all", (0, asyncWrapper_1.default)(transaction_controller_1.filterTransactions));
exports.default = router;
