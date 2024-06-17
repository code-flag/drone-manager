"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const error_1 = require("./exceptions/error");
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const database_1 = require("./config/database");
const apiRateLimit_1 = require("./middleware/apiRateLimit");
const drone_route_1 = __importDefault(require("./routes/drone.route"));
const cronJob_1 = require("./config/cronJob");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "50mb" }));
/**  ================================== Database connection ==================================  */
(0, database_1.DBConnection)();
// header preflight configuration to prevent cors error
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    credentials: false,
}));
// Body Parser middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
/** ============================= Helmet for securing api request headers =================== */
app.use((0, helmet_1.default)());
if (["development", "production"].includes(process.env.NODE_ENV || "development")) {
    app.use((0, morgan_1.default)("dev"));
}
/** ======================================= API ROUTES =======================================*/
app.use(apiRateLimit_1.limiter);
app.use(drone_route_1.default);
app.get("/", (request, response) => {
    response.status(200).json({
        status: "success",
        message: "Welcome to Drone server API",
        data: {
            service: "Drone server",
            version: "2.0.0",
        },
    });
});
/** ================================== Invalid route response ================================ */
app.all("*", (request, response) => {
    throw new error_1.NotFoundError("Invalid route.");
});
/** ===================================== CRON JOB =========================================== */
cronJob_1.BatteryLevelsScheduler.start();
/** ================================= General Errror Handling middleware ======================= */
app.use(errorHandler_1.default);
exports.default = app;
