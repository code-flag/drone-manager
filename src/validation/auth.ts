import { check } from "express-validator";

export const validateUserLogin = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be a string")
    .isEmail()
    .withMessage("Invalid email format")
    .escape(),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string"),

  check("userType")
    .notEmpty()
    .withMessage("User type is required")
    .isString()
    .withMessage("User type must be a string")
    .escape(),
];

export const validateChangePassword = [
  check("oldPassword")
    .notEmpty()
    .withMessage("Old password is required")
    .isString()
    .withMessage("Old password must be a string")
    .escape(),

  check("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isString()
    .withMessage("New password must be a string")
    .escape(),

  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .isString()
    .withMessage("Confirm password must be a string")
    .escape(),
];

export const validateResetPassword = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be a string")
    .isEmail()
    .withMessage("Invalid email format")
    .escape(),
];
