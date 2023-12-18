"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAllParamsforOrderId = exports.validateEmail = exports.validateId = void 0;
const express_validator_1 = require("express-validator");
exports.validateId = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Invalid ID")
];
exports.validateEmail = [
    (0, express_validator_1.param)("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
        .toLowerCase()
        .trim()
        .escape(),
];
exports.validateAllParamsforOrderId = [
    (0, express_validator_1.param)("orderId").isMongoId().withMessage("Invalid ID"),
];
