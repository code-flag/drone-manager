"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResetPassword = exports.validateChangePassword = exports.validateUserLogin = void 0;
const express_validator_1 = require("express-validator");
exports.validateUserLogin = [
    (0, express_validator_1.check)("email")
        .notEmpty()
        .withMessage("Email is required")
        .isString()
        .withMessage("Email must be a string")
        .isEmail()
        .withMessage("Invalid email format")
        .escape(),
    (0, express_validator_1.check)("password")
        .notEmpty()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password must be a string"),
    (0, express_validator_1.check)("userType")
        .notEmpty()
        .withMessage("User type is required")
        .isString()
        .withMessage("User type must be a string")
        .escape(),
];
exports.validateChangePassword = [
    (0, express_validator_1.check)("oldPassword")
        .notEmpty()
        .withMessage("Old password is required")
        .isString()
        .withMessage("Old password must be a string")
        .escape(),
    (0, express_validator_1.check)("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isString()
        .withMessage("New password must be a string")
        .escape(),
    (0, express_validator_1.check)("confirmPassword")
        .notEmpty()
        .withMessage("Confirm password is required")
        .isString()
        .withMessage("Confirm password must be a string")
        .escape(),
];
exports.validateResetPassword = [
    (0, express_validator_1.check)("email")
        .notEmpty()
        .withMessage("Email is required")
        .isString()
        .withMessage("Email must be a string")
        .isEmail()
        .withMessage("Invalid email format")
        .escape(),
];
