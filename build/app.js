"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const error_1 = require("./helper/error");
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const options_1 = require("./config/options");
const database_1 = require("./config/database");
const file_storage_1 = require("./config/file-storage");
const auth_1 = require("./middleware/auth");
const message_handler_1 = require("./helper/message-handler");
const apiRateLimit_1 = require("./middleware/apiRateLimit");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "50mb" }));
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, Object.assign({}, options_1.serverOptions));
/**  ================================== Database connection ==================================  */
(0, database_1.DBConnection)();
/**
 * Handles all user socket events
 */
const notification = io.of("/notification");
const deal = io.of("/deal");
/** ===================================== Middleware ===================================== */
// header preflight configuration to prevent cors error
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    credentials: false,
}));
// Body Parser middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// this is added to be able to use import.meta.value for email attachment
/** ============================= Helmet for securing api request headers =================== */
app.use((0, helmet_1.default)());
if (["development", "production"].includes(process.env.NODE_ENV || "development")) {
    app.use((0, morgan_1.default)("dev"));
}
// make folders visible
// app.use(express.static(path.join(__dirname,'public')));
/** ======================================= API ROUTES =======================================*/
app.use(apiRateLimit_1.limiter);
// app.use(router);
app.get("/", (request, response) => {
    response.status(200).json({
        status: "success",
        message: "Welcome to Market place server API",
        data: {
            service: "Market place server",
            version: "2.0.0",
        },
    });
});
/** =============================== Upload Files or documents route =============================== */
app.post("/profile-pic/upload", auth_1.verifyAccessKey, auth_1.verifyToken, file_storage_1.uploadProfilePic.single("file"), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, message_handler_1.returnMsg)(res, { url: req.file.location }, "Successfully uploaded");
    });
});
app.post("/kyc/document-upload", auth_1.verifyAccessKey, auth_1.verifyToken, file_storage_1.uploadKYCDocument.single("file"), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, message_handler_1.returnMsg)(res, { url: req.file.location }, "Successfully uploaded");
    });
});
app.post("/dispute/upload", auth_1.verifyAccessKey, auth_1.verifyToken, file_storage_1.disputeFileUpload.single("file"), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, message_handler_1.returnMsg)(res, { url: req.file.location }, "Successfully uploaded");
    });
});
app.post("/kyc/big/document-upload", auth_1.verifyAccessKey, auth_1.verifyToken, file_storage_1.uploadBigKYCDocument.single("file"), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, message_handler_1.returnMsg)(res, { url: req.file.location }, "Successfully uploaded");
    });
});
app.get("/_storage_/list/:dir", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { dir } = req.params;
        let resp = yield file_storage_1.s3
            .listObjectsV2({ Bucket: `${process.env.AWS_S3_BUCKET}` })
            .promise();
        let mapData = resp.Contents.map((item) => item.Key);
        (0, message_handler_1.returnMsg)(res, mapData, "files successfully retrieved");
    }
    catch (error) {
        console.log("error", error);
    }
}));
app.get("/storage-file/download", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { filename } = req.query;
        const baseUrl = filename.substr(0, 53);
        const subStr = filename.substr(53);
        if (baseUrl === 'https://huiospay-store.s3.eu-central-1.amazonaws.com/') {
            filename = subStr;
        }
        let objData = yield file_storage_1.s3
            .getObject({ Bucket: `${process.env.AWS_S3_BUCKET}`, Key: filename })
            .promise();
        res.send(objData);
    }
    catch (error) {
        console.log("error", error);
    }
}));
app.delete("/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { filename } = req.query;
    const baseUrl = filename.substr(0, 53);
    const subStr = filename.substr(53);
    if (baseUrl === 'https://huiospay-store.s3.eu-central-1.amazonaws.com/') {
        filename = subStr;
    }
    const deletedData = yield file_storage_1.s3
        .deleteObject({ Bucket: `${process.env.AWS_S3_BUCKET}`, Key: filename })
        .promise();
    (0, message_handler_1.returnMsg)(res, deletedData, "File Deleted Successfully");
}));
/** ================================== Invalid route response ================================ */
app.all("*", (request, response) => {
    throw new error_1.NotFoundError("Invalid route.");
});
/** ================================= General Errror Handling middleware ======================= */
app.use(errorHandler_1.default);
exports.default = app;
