"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncWrapper_1 = __importDefault(require("../middleware/asyncWrapper"));
const reviews_controller_1 = require("../controller/reviews.controller");
const router = (0, express_1.Router)();
router.post("/create", (0, asyncWrapper_1.default)(reviews_controller_1.addReview));
router.put("/update/:reviewId", (0, asyncWrapper_1.default)(reviews_controller_1.updateReview));
router.get("/all", (0, asyncWrapper_1.default)(reviews_controller_1.getManyReview));
router.get("/:reviewId", (0, asyncWrapper_1.default)(reviews_controller_1.getOneReview));
router.delete("/delete/:reviewId", (0, asyncWrapper_1.default)(reviews_controller_1.deleteReview));
exports.default = router;
