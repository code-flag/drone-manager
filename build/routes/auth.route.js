"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncWrapper_1 = __importDefault(require("../middleware/asyncWrapper"));
const validator_1 = __importDefault(require("../middleware/validator"));
const auth_1 = require("../validation/auth");
const auth_2 = require("../controller/auth");
const router = (0, express_1.Router)();
router.post("/login", 
//   verifyAccessKey,
(0, validator_1.default)(auth_1.validateUserLogin), (0, asyncWrapper_1.default)(auth_2.loginUser));
router.post("/change-password", 
//   verifyAccessKey,
//   verifyToken,
(0, validator_1.default)(auth_1.validateChangePassword), (0, asyncWrapper_1.default)(auth_2.changePassword));
router.post("/reset-password", 
//   verifyAccessKey,
(0, validator_1.default)(auth_1.validateResetPassword), (0, asyncWrapper_1.default)(auth_2.askToResetPassword));
router.post("/reset-password-account", 
//   verifyAccessKey,
(0, validator_1.default)(auth_1.validateResetPassword), (0, asyncWrapper_1.default)(auth_2.confirmResetPassword));
router.get("/access-key", (0, asyncWrapper_1.default)(auth_2.accessKey));
exports.default = router;
