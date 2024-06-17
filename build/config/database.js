"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConnection = exports.getURI = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getURI = async () => {
    var _a;
    try {
        // const mongod = new MongoMemoryServer();
        let mongod;
        mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = process.env.NODE_ENV !== "production" ? await mongod.getUri() : (_a = process.env.DB_CONNECTION_URL) !== null && _a !== void 0 ? _a : "";
        console.log("db uri ", uri);
        return uri + "drone?retryWrites=true&w=majority";
    }
    catch (error) {
        console.log("uri err ", error);
        return "";
    }
};
exports.getURI = getURI;
mongoose_1.default.set("strictQuery", true);
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
const DBConnection = async () => {
    mongoose_1.default.connect(await (0, exports.getURI)(), options, (err) => {
        if (err) {
            console.log("error could not connect to database \n", err === null || err === void 0 ? void 0 : err.message);
        }
        else {
            console.log("Database successfully connected");
        }
    });
};
exports.DBConnection = DBConnection;
