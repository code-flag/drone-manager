"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomPassword = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateRandomPassword = (length) => {
    const result = crypto_1.default.randomBytes(length).toString("hex");
    return result;
};
exports.generateRandomPassword = generateRandomPassword;
