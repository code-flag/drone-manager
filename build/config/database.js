"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const url = (_a = process.env.DB_CONNECTION_URL) !== null && _a !== void 0 ? _a : "";
mongoose_1.default.set("strictQuery", true);
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
const DBConnection = () => {
    mongoose_1.default.connect(url, options, (err) => {
        if (err) {
            console.log("error could not connect to database \n", err === null || err === void 0 ? void 0 : err.message);
        }
        else {
            console.log("Database successfully connected");
        }
    });
};
exports.DBConnection = DBConnection;
