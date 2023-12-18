"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncWrapper_1 = __importDefault(require("../middleware/asyncWrapper"));
const statistics_1 = require("../controller/statistics");
const router = (0, express_1.Router)();
router.get("/overview", (0, asyncWrapper_1.default)(statistics_1.userAndTransactionRecord));
exports.default = router;
