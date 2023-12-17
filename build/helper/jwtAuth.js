"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAuthToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const generateAuthToken = ({ id, _id, email }) => {
    var _a;
    return jsonwebtoken_1.default.sign({ id, _id, email }, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : '', {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
exports.generateAuthToken = generateAuthToken;
exports.default = exports.generateAuthToken;
