"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = exports.validateUpdateUser = exports.validateCreateUser = void 0;
const express_validator_1 = require("express-validator");
// export default {
//   userSchema: [
//     check("accesskey")
//       .optional()
//       .isMongoId()
//       .withMessage("Invalid access key."),
//     check("email")
//       .not()
//       .isEmpty()
//       .withMessage("Email address is required.")
//       .trim()
//       .isEmail()
//       .withMessage("Enter a valid email address."),
//     check("userName").not().isEmpty().withMessage("User name is required."),
//     check("firstName").not().isEmpty().withMessage("First name is required."),
//     check("lastName").not().isEmpty().withMessage("Last name is required."),
//     check("phoneNumber")
//       .not()
//       .isEmpty()
//       .withMessage("Phone number is required."),
//     check("address").not().isEmpty().withMessage("Address is required"),
//     check("gender")
//       .optional()
//       .not()
//       .isEmpty()
//       .withMessage("gender can not be non"),
//     check("password")
//       .not()
//       .isEmpty({ ignore_whitespace: true })
//       .withMessage("Password is required.")
//       .isLength({ min: 8, max: 45 })
//       .withMessage("Password should be between 8 to 45 characters.")
//       .matches("[0-9]")
//       .withMessage("Password must contain a number.")
//       .matches("[A-Z]")
//       .withMessage("Password must contain an uppercase letter.")
//       .matches("[a-z]")
//       .withMessage("New password must contain a lowercase letter."),
//   ],
//   getUserSchema: [
//     check("accesskey")
//       .optional()
//       .isMongoId()
//       .withMessage("Invalid access key."),
//     check("id")
//       .not()
//       .isEmpty()
//       .withMessage("User Id is required")
//       .isMongoId()
//       .withMessage("Invalid user Id."),
//   ],
//   updateUserSchema: [
//     check("accesskey")
//       .optional()
//       .isMongoId()
//       .withMessage("Invalid access key."),
//     check("id")
//       .not()
//       .isEmpty()
//       .withMessage("User Id is required.")
//       .isMongoId()
//       .withMessage("Invalid user Id."),
//   ],
// };
exports.validateCreateUser = [
    (0, express_validator_1.check)("userName")
        .optional()
        .notEmpty()
        .withMessage("User name is required")
        .isString()
        .withMessage("User name must be a string")
        .escape(),
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
    (0, express_validator_1.check)("countryCode")
        .notEmpty()
        .withMessage("Country code is required")
        .isString()
        .withMessage("Country code must be a string")
        .escape(),
    (0, express_validator_1.check)("phone")
        .notEmpty()
        .withMessage("Phone number is required")
        .isString()
        .withMessage("Phone number must be a string")
        .escape(),
    (0, express_validator_1.check)("avatar")
        .optional()
        .isString()
        .withMessage("Avatar must be a string")
        .escape(),
    (0, express_validator_1.check)("gender")
        .optional()
        .isString()
        .withMessage("Gender must be a string")
        .escape(),
    (0, express_validator_1.check)("address")
        .optional()
        .isString()
        .withMessage("Address must be a string")
        .escape(),
    (0, express_validator_1.check)("regNo")
        .optional()
        .isString()
        .withMessage("Registration number must be a string")
        .escape(),
    (0, express_validator_1.check)("email")
        .notEmpty()
        .withMessage("Email is required")
        .isString()
        .withMessage("Email must be a string")
        .isEmail()
        .withMessage("Invalid email format")
        .escape(),
    (0, express_validator_1.check)("multiFactorAuth")
        .optional()
        .isBoolean()
        .withMessage("Multi-factor authentication must be a boolean"),
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
    (0, express_validator_1.check)("TCAgreement")
        .optional()
        .isBoolean()
        .withMessage("Terms and conditions agreement must be a boolean"),
    (0, express_validator_1.check)("isDeleted")
        .optional()
        .isBoolean()
        .withMessage("isDeleted must be a boolean"),
    (0, express_validator_1.check)("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean"),
];
exports.validateUpdateUser = [
    (0, express_validator_1.param)("userId").isMongoId().withMessage("Invalid ID"),
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
    (0, express_validator_1.check)("countryCode")
        .optional()
        .isString()
        .withMessage("Country code must be a string")
        .notEmpty()
        .withMessage("Country code cannot be empty")
        .escape(),
    (0, express_validator_1.check)("phone")
        .optional()
        .isString()
        .withMessage("Phone must be a string")
        .notEmpty()
        .withMessage("Phone cannot be empty")
        .escape(),
    (0, express_validator_1.check)("avatar")
        .optional()
        .isString()
        .withMessage("Avatar must be a string")
        .notEmpty()
        .withMessage("Avatar cannot be empty")
        .escape(),
    (0, express_validator_1.check)("gender")
        .optional()
        .isString()
        .withMessage("Gender must be a string")
        .escape(),
    (0, express_validator_1.check)("address")
        .optional()
        .isString()
        .withMessage("Address must be a string")
        .escape(),
    (0, express_validator_1.check)("regNo")
        .optional()
        .isString()
        .withMessage("RegNo must be a string")
        .escape(),
    (0, express_validator_1.check)("userName")
        .optional()
        .isString()
        .withMessage("Username must be a string")
        .escape(),
    (0, express_validator_1.check)("email")
        .optional()
        .isString()
        .withMessage("Email must be a string")
        .isEmail()
        .withMessage("Invalid email format")
        .toLowerCase()
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Email cannot be empty")
        .escape(),
    (0, express_validator_1.check)("multiFactorAuth")
        .optional()
        .isBoolean()
        .withMessage("MultiFactorAuth must be a boolean"),
    (0, express_validator_1.check)("password")
        .optional()
        .isString()
        .withMessage("Password must be a string")
        .escape(),
    (0, express_validator_1.check)("oneTimePassword")
        .optional()
        .isBoolean()
        .withMessage("OneTimePassword must be a boolean"),
    (0, express_validator_1.check)("firebaseNotificationToken")
        .optional()
        .isString()
        .withMessage("FirebaseNotificationToken must be a string")
        .escape(),
    (0, express_validator_1.check)("TCAgreement")
        .optional()
        .isBoolean()
        .withMessage("TCAgreement must be a boolean"),
    (0, express_validator_1.check)("isDeleted")
        .optional()
        .isBoolean()
        .withMessage("IsDeleted must be a boolean"),
    (0, express_validator_1.check)("isActive")
        .optional()
        .isBoolean()
        .withMessage("IsActive must be a boolean"),
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
