"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const debug_1 = __importDefault(require("debug"));
const http_1 = __importDefault(require("http"));
const DEBUG = (0, debug_1.default)("dev");
const PORT = process.env.NODE_ENV === "test" ? 3200 : process.env.PORT || 3200;
const host = process.env.HOST || "http://localhost";
process.on("uncaughtException", (error) => {
    DEBUG(`uncaught exception: ${error.message}`);
    process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
    DEBUG(`unhandled rejection at ${promise} reason: ${reason}`);
    process.exit(1);
});
const server = http_1.default.createServer(app_1.default);
server.listen(PORT, () => {
    DEBUG(`server running on  ${host}:${PORT} in ${process.env.NODE_ENV} mode.\npress CTRL-C to stop`);
});
