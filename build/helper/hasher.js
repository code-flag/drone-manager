"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.encryptPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
// Hash password to ensure it security
const encryptPassword = async (password) => {
    var _a;
    const saltRounds = await bcryptjs_1.default.genSalt(Number((_a = process.env.SALT_ROUNDS) !== null && _a !== void 0 ? _a : 10));
    return await bcryptjs_1.default.hash(password, saltRounds);
};
exports.encryptPassword = encryptPassword;
// Verify password by comparing with hashed password
const verifyPassword = async (password, hash) => {
    return await bcryptjs_1.default.compare(password, hash);
};
exports.verifyPassword = verifyPassword;
