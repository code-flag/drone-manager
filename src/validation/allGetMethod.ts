import { param } from "express-validator";

export const validateId = [
  param("id").isMongoId().withMessage("Invalid ID")
];

export const validateEmail = [
  param("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .toLowerCase()
    .trim()
    .escape(),
];

export const validateAllParamsforOrderId = [
  param("orderId").isMongoId().withMessage("Invalid ID"),
];
