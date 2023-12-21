"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncWrapper_1 = __importDefault(require("../middleware/asyncWrapper"));
const staff_controller_1 = require("../controller/staff.controller");
const router = (0, express_1.Router)();
router.post("/", 
// verifyAccessKey,
// validator(CreateStaff),
(0, asyncWrapper_1.default)(staff_controller_1.createStaff));
router.post("/resend-otp/:userId", (0, asyncWrapper_1.default)(staff_controller_1.resendOtp));
router.post("/confirmation/otp", (0, asyncWrapper_1.default)(staff_controller_1.verifyRegConfirmationOTP));
router.post("/verify-otp", (0, asyncWrapper_1.default)(staff_controller_1.verifyOTP));
router.post("/generate-otp/:email", (0, asyncWrapper_1.default)(staff_controller_1.generateOtp));
router.get("/", 
// verifyAccessKey,
// verifyToken,
(0, asyncWrapper_1.default)(staff_controller_1.getAllStaff));
router.get("/total", 
// verifyAccessKey,
// verifyToken,
(0, asyncWrapper_1.default)(staff_controller_1.getAllStaffCount));
router.get("/:staffId", 
// verifyAccessKey,
// verifyToken,
(0, asyncWrapper_1.default)(staff_controller_1.getOneStaff));
router.put("/info/:staffId", 
// verifyAccessKey,
// verifyToken,
(0, asyncWrapper_1.default)(staff_controller_1.updateStaffInfo));
router.patch("/social-media/:staffId", 
// verifyAccessKey,
// verifyToken,
(0, asyncWrapper_1.default)(staff_controller_1.updateStaffSocialMedia));
router.delete("/delete/:staffId", 
// verifyAccessKey,
// verifyToken,
(0, asyncWrapper_1.default)(staff_controller_1.deleteStaff));
exports.default = router;
