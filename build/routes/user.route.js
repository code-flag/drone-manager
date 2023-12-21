"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const asyncWrapper_1 = __importDefault(require("../middleware/asyncWrapper"));
const user_controller_1 = require("../controller/user.controller");
const validator_1 = __importDefault(require("../middleware/validator"));
const user_1 = require("../validation/user");
const router = (0, express_1.Router)();
router.post("/register", 
// verifyAccessKey,
// validator(validateCreateUser),
(0, asyncWrapper_1.default)(user_controller_1.createUser));
router.get("/all", auth_1.verifyAccessKey, auth_1.verifyToken, (0, asyncWrapper_1.default)(user_controller_1.getAllUser));
router.get("/email/:email", auth_1.verifyAccessKey, auth_1.verifyToken, (0, validator_1.default)(user_1.validateEmail), (0, asyncWrapper_1.default)(user_controller_1.getUserByEmail));
router.get("/:userId", auth_1.verifyAccessKey, auth_1.verifyToken, (0, auth_1.typePermit)("user", "staff", "organization", "admin"), 
// validator(validateId),
(0, asyncWrapper_1.default)(user_controller_1.getOneUser));
router.get("/count", auth_1.verifyAccessKey, auth_1.verifyToken, 
// typePermit("staff", "organization", "admin"),
(0, asyncWrapper_1.default)(user_controller_1.getAllUserCount));
router.post("/resend-otp/:userId", auth_1.verifyAccessKey, (0, asyncWrapper_1.default)(user_controller_1.resendOtp));
router.post("/confirmation/otp", auth_1.verifyAccessKey, (0, asyncWrapper_1.default)(user_controller_1.verifyRegConfirmationOTP));
router.post("/verify-otp", auth_1.verifyAccessKey, (0, asyncWrapper_1.default)(user_controller_1.verifyOTP));
router.post("/generate-otp/:email", auth_1.verifyAccessKey, (0, asyncWrapper_1.default)(user_controller_1.generateOtp));
router.put("/update/:userId", auth_1.verifyAccessKey, auth_1.verifyToken, (0, asyncWrapper_1.default)(user_controller_1.updateUserInfo));
router.delete("/delete/:userId", auth_1.verifyAccessKey, auth_1.verifyToken, (0, asyncWrapper_1.default)(user_controller_1.deleteUser));
exports.default = router;
