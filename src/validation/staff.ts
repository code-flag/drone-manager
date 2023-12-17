import { check, param } from "express-validator";

export const validateParamsforStaff = [
  param("staffId").isMongoId().withMessage("Invalid ID"),
];

export const CreateStaff = [
  check("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isString()
    .withMessage("First name must be a string")
    .escape(),

  check("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isString()
    .withMessage("Last name must be a string")
    .escape(),

  check("avatar")
    .optional()
    .isString()
    .withMessage("Avatar must be a string")
    .escape(),

  check("address")
    .notEmpty()
    .withMessage("Address is required")
    .isString()
    .withMessage("Address must be a string")
    .escape(),

  check("proofOfAddress")
    .optional()
    .isString()
    .withMessage("Proof of address must be a string")
    .escape(),

  check("nin")
    .optional()
    .isString()
    .withMessage("NIN must be a string")
    .escape(),

  check("proofOfNIN")
    .optional()
    .isString()
    .withMessage("Proof of NIN must be a string")
    .escape(),

  check("country")
    .optional()
    .isString()
    .withMessage("Country must be a string")
    .escape(),

  check("state")
    .optional()
    .isString()
    .withMessage("State must be a string")
    .escape(),

  check("lga")
    .optional()
    .isString()
    .withMessage("LGA must be a string")
    .escape(),

  check("payoutAccount")
    .optional()
    .isObject()
    .withMessage("Invalid payout account"),

  check("socialMedia")
    .optional()
    .isArray()
    .withMessage("Invalid social media accounts"),

  check("department")
    .optional()
    .isString()
    .withMessage("Department must be a string")
    .escape(),

  check("role")
    .optional()
    .isIn(["staff", "admin", "support", "accountant", "developer", "technical", "operation", "marketer",  "super-admin"])
    .withMessage("Invalid role"),

  check("email")
    .notEmpty()
    .isString()
    .withMessage("Email must be a string")
    .escape()
    .trim()
    .isEmail()
    .withMessage("Enter a valid email address."),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string"),

  check("oneTimePassword")
    .optional()
    .isBoolean()
    .withMessage("One-time password must be a boolean"),

  check("firebaseNotificationToken")
    .optional()
    .isString()
    .withMessage("Firebase notification token must be a string")
    .escape(),

  check("isDeleted")
    .optional()
    .isBoolean()
    .withMessage("IsDeleted must be a boolean"),

  check("isActive")
    .optional()
    .isBoolean()
    .withMessage("IsActive must be a boolean"),
];

export const updateStaff = [
  param("staffId").isMongoId().withMessage("Invalid ID"),

  check("firstName")
    .optional()
    .isString()
    .withMessage("First name must be a string")
    .notEmpty()
    .withMessage("First name cannot be empty")
    .escape(),

  check("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be a string")
    .notEmpty()
    .withMessage("Last name cannot be empty")
    .escape(),

  check("avatar")
    .optional()
    .isString()
    .withMessage("Avatar must be a string")
    .notEmpty()
    .withMessage("Avatar cannot be empty")
    .escape(),

  check("address")
    .optional()
    .isString()
    .withMessage("Address must be a string")
    .notEmpty()
    .withMessage("Address cannot be empty")
    .escape(),

  check("proofOfAddress")
    .optional()
    .isString()
    .withMessage("Proof of address must be a string")
    .notEmpty()
    .withMessage("Proof of address cannot be empty")
    .escape(),

  check("nin")
    .optional()
    .isString()
    .withMessage("NIN must be a string")
    .notEmpty()
    .withMessage("NIN cannot be empty")
    .escape(),

  check("proofOfNIN")
    .optional()
    .isString()
    .withMessage("Proof of NIN must be a string")
    .notEmpty()
    .withMessage("Proof of NIN cannot be empty")
    .escape(),

  check("country")
    .optional()
    .isString()
    .withMessage("Country must be a string")
    .notEmpty()
    .withMessage("Country cannot be empty")
    .escape(),

  check("state")
    .optional()
    .isString()
    .withMessage("State must be a string")
    .notEmpty()
    .withMessage("State cannot be empty")
    .escape(),

  check("lga")
    .optional()
    .isString()
    .withMessage("LGA must be a string")
    .notEmpty()
    .withMessage("LGA cannot be empty")
    .escape(),

  check("payoutAccount")
    .optional()
    .isObject()
    .withMessage("Invalid payout account"),

  check("socialMedia")
    .optional()
    .isArray()
    .withMessage("Invalid social media accounts"),

  check("department")
    .optional()
    .isString()
    .withMessage("Department must be a string")
    .notEmpty()
    .withMessage("Department cannot be empty")
    .escape(),

  check("role")
    .optional()
    .isIn(["staff", "admin", "support", "operation", "super-admin"])
    .withMessage("Invalid role"),

  check("email")
    .optional()
    .isString()
    .withMessage("Email must be a string")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .escape()
    .trim()
    .isEmail()
    .withMessage("Enter a valid email address."),

  check("password")
    .optional()
    .isString()
    .withMessage("Password must be a string"),

  check("oneTimePassword")
    .optional()
    .isBoolean()
    .withMessage("One-time password must be a boolean"),

  check("firebaseNotificationToken")
    .optional()
    .isString()
    .withMessage("Firebase notification token must be a string")
    .notEmpty()
    .withMessage("Firebase notification token cannot be empty")
    .escape(),

  check("isDeleted")
    .optional()
    .isBoolean()
    .withMessage("IsDeleted must be a boolean"),

  check("isActive")
    .optional()
    .isBoolean()
    .withMessage("IsActive must be a boolean"),
];

export const validateSocials = [
  param("staffId").isMongoId().withMessage("Invalid ID"),

  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .escape(),

  check("url")
    .notEmpty()
    .withMessage("URL is required")
    .isString()
    .withMessage("URL must be a string")
    .escape(),
];
