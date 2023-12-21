"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const asyncWrapper_1 = __importDefault(require("../middleware/asyncWrapper"));
const user_controller_1 = require("../controller/user.controller");
const router = (0, express_1.Router)();
router.post("/register", 
// verifyAccessKey,
// validator(validateCreateUser),
(0, asyncWrapper_1.default)(user_controller_1.createUser));
router.get("/all", (0, asyncWrapper_1.default)(user_controller_1.getAllUser));
router.get("/email/:email", 
// verifyAccessKey,
// verifyToken,
// validator(validateEmail),
(0, asyncWrapper_1.default)(user_controller_1.getUserByEmail));
router.get("/:userId", 
// verifyAccessKey,
// verifyToken,
// typePermit("user", "staff", "organization", "admin"),
// validator(validateId),
(0, asyncWrapper_1.default)(user_controller_1.getOneUser));
router.get("/count", 
// verifyAccessKey,
// verifyToken,
// typePermit("staff", "organization", "admin"),
(0, asyncWrapper_1.default)(user_controller_1.getAllUserCount));
router.post("/resend-otp/:userId", auth_1.verifyAccessKey, (0, asyncWrapper_1.default)(user_controller_1.resendOtp));
router.post("/confirmation/otp", 
// verifyAccessKey,
(0, asyncWrapper_1.default)(user_controller_1.verifyRegConfirmationOTP));
router.post("/verify-otp", auth_1.verifyAccessKey, (0, asyncWrapper_1.default)(user_controller_1.verifyOTP));
router.post("/generate-otp/:email", auth_1.verifyAccessKey, (0, asyncWrapper_1.default)(user_controller_1.generateOtp));
router.put("/update/:userId", 
// verifyAccessKey,
// verifyToken,
(0, asyncWrapper_1.default)(user_controller_1.updateUserInfo));
router.delete("/delete/:userId", 
// verifyAccessKey,
// verifyToken,
(0, asyncWrapper_1.default)(user_controller_1.deleteUser));
exports.default = router;
