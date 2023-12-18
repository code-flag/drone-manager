"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSocials = exports.updateStaff = exports.CreateStaff = exports.validateParamsforStaff = void 0;
const express_validator_1 = require("express-validator");
exports.validateParamsforStaff = [
    (0, express_validator_1.param)("staffId").isMongoId().withMessage("Invalid ID"),
];
exports.CreateStaff = [
    (0, express_validator_1.check)("firstName")
        .notEmpty()
        .withMessage("First name is required")
        .isString()
        .withMessage("First name must be a string")
        .escape(),
    (0, express_validator_1.check)("lastName")
        .notEmpty()
        .withMessage("Last name is required")
        .isString()
        .withMessage("Last name must be a string")
        .escape(),
    (0, express_validator_1.check)("avatar")
        .optional()
        .isString()
        .withMessage("Avatar must be a string")
        .escape(),
    (0, express_validator_1.check)("address")
        .notEmpty()
        .withMessage("Address is required")
        .isString()
        .withMessage("Address must be a string")
        .escape(),
    (0, express_validator_1.check)("proofOfAddress")
        .optional()
        .isString()
        .withMessage("Proof of address must be a string")
        .escape(),
    (0, express_validator_1.check)("nin")
        .optional()
        .isString()
        .withMessage("NIN must be a string")
        .escape(),
    (0, express_validator_1.check)("proofOfNIN")
        .optional()
        .isString()
        .withMessage("Proof of NIN must be a string")
        .escape(),
    (0, express_validator_1.check)("country")
        .optional()
        .isString()
        .withMessage("Country must be a string")
        .escape(),
    (0, express_validator_1.check)("state")
        .optional()
        .isString()
        .withMessage("State must be a string")
        .escape(),
    (0, express_validator_1.check)("lga")
        .optional()
        .isString()
        .withMessage("LGA must be a string")
        .escape(),
    (0, express_validator_1.check)("payoutAccount")
        .optional()
        .isObject()
        .withMessage("Invalid payout account"),
    (0, express_validator_1.check)("socialMedia")
        .optional()
        .isArray()
        .withMessage("Invalid social media accounts"),
    (0, express_validator_1.check)("department")
        .optional()
        .isString()
        .withMessage("Department must be a string")
        .escape(),
    (0, express_validator_1.check)("role")
        .optional()
        .isIn(["staff", "admin", "support", "accountant", "developer", "technical", "operation", "marketer", "super-admin"])
        .withMessage("Invalid role"),
    (0, express_validator_1.check)("email")
        .notEmpty()
        .isString()
        .withMessage("Email must be a string")
        .escape()
        .trim()
        .isEmail()
        .withMessage("Enter a valid email address."),
    (0, express_validator_1.check)("password")
        .notEmpty()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password must be a string"),
    (0, express_validator_1.check)("oneTimePassword")
        .optional()
        .isBoolean()
        .withMessage("One-time password must be a boolean"),
    (0, express_validator_1.check)("firebaseNotificationToken")
        .optional()
        .isString()
        .withMessage("Firebase notification token must be a string")
        .escape(),
    (0, express_validator_1.check)("isDeleted")
        .optional()
        .isBoolean()
        .withMessage("IsDeleted must be a boolean"),
    (0, express_validator_1.check)("isActive")
        .optional()
        .isBoolean()
        .withMessage("IsActive must be a boolean"),
];
exports.updateStaff = [
    (0, express_validator_1.param)("staffId").isMongoId().withMessage("Invalid ID"),
    (0, express_validator_1.check)("firstName")
        .optional()
        .isString()
        .withMessage("First name must be a string")
        .notEmpty()
        .withMessage("First name cannot be empty")
        .escape(),
    (0, express_validator_1.check)("lastName")
        .optional()
        .isString()
        .withMessage("Last name must be a string")
        .notEmpty()
        .withMessage("Last name cannot be empty")
        .escape(),
    (0, express_validator_1.check)("avatar")
        .optional()
        .isString()
        .withMessage("Avatar must be a string")
        .notEmpty()
        .withMessage("Avatar cannot be empty")
        .escape(),
    (0, express_validator_1.check)("address")
        .optional()
        .isString()
        .withMessage("Address must be a string")
        .notEmpty()
        .withMessage("Address cannot be empty")
        .escape(),
    (0, express_validator_1.check)("proofOfAddress")
        .optional()
        .isString()
        .withMessage("Proof of address must be a string")
        .notEmpty()
        .withMessage("Proof of address cannot be empty")
        .escape(),
    (0, express_validator_1.check)("nin")
        .optional()
        .isString()
        .withMessage("NIN must be a string")
        .notEmpty()
        .withMessage("NIN cannot be empty")
        .escape(),
    (0, express_validator_1.check)("proofOfNIN")
        .optional()
        .isString()
        .withMessage("Proof of NIN must be a string")
        .notEmpty()
        .withMessage("Proof of NIN cannot be empty")
        .escape(),
    (0, express_validator_1.check)("country")
        .optional()
        .isString()
        .withMessage("Country must be a string")
        .notEmpty()
        .withMessage("Country cannot be empty")
        .escape(),
    (0, express_validator_1.check)("state")
        .optional()
        .isString()
        .withMessage("State must be a string")
        .notEmpty()
        .withMessage("State cannot be empty")
        .escape(),
    (0, express_validator_1.check)("lga")
        .optional()
        .isString()
        .withMessage("LGA must be a string")
        .notEmpty()
        .withMessage("LGA cannot be empty")
        .escape(),
    (0, express_validator_1.check)("payoutAccount")
        .optional()
        .isObject()
        .withMessage("Invalid payout account"),
    (0, express_validator_1.check)("socialMedia")
        .optional()
        .isArray()
        .withMessage("Invalid social media accounts"),
    (0, express_validator_1.check)("department")
        .optional()
        .isString()
        .withMessage("Department must be a string")
        .notEmpty()
        .withMessage("Department cannot be empty")
        .escape(),
    (0, express_validator_1.check)("role")
        .optional()
        .isIn(["staff", "admin", "support", "operation", "super-admin"])
        .withMessage("Invalid role"),
    (0, express_validator_1.check)("email")
        .optional()
        .isString()
        .withMessage("Email must be a string")
        .notEmpty()
        .withMessage("Email cannot be empty")
        .escape()
        .trim()
        .isEmail()
        .withMessage("Enter a valid email address."),
    (0, express_validator_1.check)("password")
        .optional()
        .isString()
        .withMessage("Password must be a string"),
    (0, express_validator_1.check)("oneTimePassword")
        .optional()
        .isBoolean()
        .withMessage("One-time password must be a boolean"),
    (0, express_validator_1.check)("firebaseNotificationToken")
        .optional()
        .isString()
        .withMessage("Firebase notification token must be a string")
        .notEmpty()
        .withMessage("Firebase notification token cannot be empty")
        .escape(),
    (0, express_validator_1.check)("isDeleted")
        .optional()
        .isBoolean()
        .withMessage("IsDeleted must be a boolean"),
    (0, express_validator_1.check)("isActive")
        .optional()
        .isBoolean()
        .withMessage("IsActive must be a boolean"),
];
exports.validateSocials = [
    (0, express_validator_1.param)("staffId").isMongoId().withMessage("Invalid ID"),
    (0, express_validator_1.check)("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string")
        .escape(),
    (0, express_validator_1.check)("url")
        .notEmpty()
        .withMessage("URL is required")
        .isString()
        .withMessage("URL must be a string")
        .escape(),
];
