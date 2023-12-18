"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncWrapper_1 = __importDefault(require("../middleware/asyncWrapper"));
const _2FAuth_controller_1 = require("../controller/2FAuth.controller");
const _2FAuth_controller_2 = require("../controller/2FAuth.controller");
const router = (0, express_1.Router)();
router.post("/generate-secret", (0, asyncWrapper_1.default)(_2FAuth_controller_2.Activate2Fa));
router.post("/verify2FAToken", (0, asyncWrapper_1.default)(_2FAuth_controller_1.validateToken));
exports.default = router;
