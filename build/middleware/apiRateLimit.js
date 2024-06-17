"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = void 0;
const rateLimit = require("express-rate-limit");
// Define your rate limit options
exports.limiter = rateLimit({
    windowMs: 0.4 * 60 * 1000, // 15 secs
    max: 10, // Max requests per IP within the windowMs
    handler: (req, res) => {
        res.status(429).json({
            message: {
                error: "Too many requests, please try again later.",
            },
        });
    },
});
