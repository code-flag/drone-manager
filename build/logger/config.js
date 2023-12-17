"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOG_META = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.default = {
    env: process.env.NODE_ENV,
    host: process.env.PORT,
    meta: "Transaction:server",
    version: "1.0.0"
};
// Default log meta
exports.LOG_META = "Transaction:server";
