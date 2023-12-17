"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const debug_1 = __importDefault(require("debug"));
(0, dotenv_1.config)();
const DEBUG = (0, debug_1.default)("dev");
exports.default = (error, _, response, next) => {
    const isProduction = process.env.NODE_ENV === "production";
    let errorMessage = {};
    if (response.headersSent) {
        return next(error);
    }
    if (!isProduction) {
        DEBUG(error.stack);
        errorMessage = error;
    }
    return response.status(error.statusCode || 500).json({
        status: "error",
        error: Object.assign(Object.assign({ message: error.message }, (error.errors && { errors: error.errors })), (!isProduction && { trace: errorMessage })),
    });
};
