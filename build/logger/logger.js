"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.HTTPpLogger = exports.logger = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const winston_1 = __importStar(require("winston"));
const config_1 = require("./config");
dotenv_1.default.config();
/**
 * Logger instance singleton. A new logger will only be created if we pass
 * the `forceNew=true`
 */
let loggerInstance = null;
let logDirectory = "./logs";
const logger = (logMeta = config_1.LOG_META, forceNew = false, timeFormat = "") => {
    // const logFormat = format.printf(({ timestamp, level, message }) => {
    //     return `${timestamp} ${level}: ${message}`;
    // });
    if (loggerInstance === null || forceNew) {
        try {
            loggerInstance = (0, winston_1.createLogger)({
                defaultMeta: { service: logMeta },
                format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp(), winston_1.format.json()),
                transports: [
                    new winston_1.transports.File({ filename: 'error.log', level: 'error', dirname: logDirectory }),
                    new winston_1.transports.File({ filename: 'combined.log', dirname: logDirectory }),
                ],
                exitOnError: false,
            });
        }
        catch (err) {
            console.error("Could not create logger instance", err.message);
        }
    }
    if (loggerInstance === null) {
        console.error("Logger instance could not be created");
        // return dummy logger instance
        return (0, winston_1.createLogger)();
    }
    else {
        if (process.env.NODE_ENV !== 'production') {
            loggerInstance.add(new winston_1.default.transports.Console({
                format: winston_1.default.format.simple(),
            }));
        }
        ;
        return loggerInstance;
    }
};
exports.logger = logger;
const HTTPpLogger = () => {
};
exports.HTTPpLogger = HTTPpLogger;
// alias  for logger quick usage
const log = () => (0, exports.logger)();
exports.log = log;
exports.default = exports.logger;
