"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const asyncWrapper_1 = __importDefault(require("../middleware/asyncWrapper"));
const validator_1 = __importDefault(require("../middleware/validator"));
const staff_controller_1 = require("../controller/staff.controller");
const staff_1 = require("../validation/staff");
const router = (0, express_1.Router)();
router.post("/", 
// verifyAccessKey,
(0, validator_1.default)(staff_1.CreateStaff), (0, asyncWrapper_1.default)(staff_controller_1.createStaff));
router.post("/resend-otp/:userId", auth_1.verifyAccessKey, (0, asyncWrapper_1.default)(staff_controller_1.resendOtp));
router.post("/confirmation/otp", auth_1.verifyAccessKey, (0, asyncWrapper_1.default)(staff_controller_1.verifyRegConfirmationOTP));
router.post("/verify-otp", auth_1.verifyAccessKey, (0, asyncWrapper_1.default)(staff_controller_1.verifyOTP));
router.post("/generate-otp/:email", auth_1.verifyAccessKey, (0, asyncWrapper_1.default)(staff_controller_1.generateOtp));
router.get("/", auth_1.verifyAccessKey, auth_1.verifyToken, (0, auth_1.typePermit)("staff", "admin", "super-admin"), (0, asyncWrapper_1.default)(staff_controller_1.getAllStaff));
router.get("/total", auth_1.verifyAccessKey, auth_1.verifyToken, (0, auth_1.typePermit)("staff", "admin", "super-admin"), (0, asyncWrapper_1.default)(staff_controller_1.getAllStaffCount));
router.get("/:staffId", auth_1.verifyAccessKey, auth_1.verifyToken, (0, auth_1.typePermit)("staff", "admin", "super-admin"), (0, validator_1.default)(staff_1.validateParamsforStaff), (0, asyncWrapper_1.default)(staff_controller_1.getOneStaff));
router.put("/info/:staffId", auth_1.verifyAccessKey, auth_1.verifyToken, (0, auth_1.typePermit)("staff", "admin", "super-admin"), (0, validator_1.default)(staff_1.updateStaff), (0, asyncWrapper_1.default)(staff_controller_1.updateStaffInfo));
router.patch("/social-media/:staffId", auth_1.verifyAccessKey, auth_1.verifyToken, (0, auth_1.typePermit)("staff", "admin", "super-admin"), (0, validator_1.default)(staff_1.validateSocials), (0, asyncWrapper_1.default)(staff_controller_1.updateStaffSocialMedia));
router.delete("/delete/:staffId", auth_1.verifyAccessKey, auth_1.verifyToken, (0, auth_1.typePermit)("staff", "admin", "super-admin"), (0, asyncWrapper_1.default)(staff_controller_1.deleteStaff));
exports.default = router;
