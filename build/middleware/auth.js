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
exports.rolePermit = exports.typePermit = exports.accessLevelPermit = exports.verifyToken = exports.verifyAccessKey = void 0;
const asyncWrapper_1 = __importDefault(require("./asyncWrapper"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("../helper/error");
const crypto_js_1 = __importDefault(require("crypto-js"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_schema_1 = require("../model/index.schema");
dotenv_1.default.config();
exports.verifyAccessKey = (0, asyncWrapper_1.default)((request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { accesskey } = request.headers;
    if (!accesskey) {
        throw new error_1.UnauthorizedError("Access denied");
    }
    // check if access token is valid
    try {
        const bytes = crypto_js_1.default.AES.decrypt(accesskey, (_a = process.env.ACCESS_SEC_KEY) !== null && _a !== void 0 ? _a : '');
        const decryptedData = JSON.parse(bytes.toString(crypto_js_1.default.enc.Utf8));
        const accessTimer = (decryptedData === null || decryptedData === void 0 ? void 0 : decryptedData.lock) ? Math.floor(Date.now() - (decryptedData === null || decryptedData === void 0 ? void 0 : decryptedData.lock)) / 1000 : 1000;
        if (accessTimer < 1) {
            return next(new error_1.ForbiddenError("Invalid access key"));
        }
    }
    catch (error) {
        throw new error_1.ForbiddenError("Access denied (AK)");
    }
    return next();
}));
exports.verifyToken = (0, asyncWrapper_1.default)((request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { authorization } = request.headers;
    if (!authorization) {
        throw new error_1.UnauthorizedError("No token provided.");
    }
    let token;
    if (authorization.startsWith("Bearer ")) {
        [, token] = authorization.split(" ");
    }
    else {
        token = authorization;
    }
    jsonwebtoken_1.default.verify(token, (_b = process.env.JWT_SECRET) !== null && _b !== void 0 ? _b : "", (error, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        var _c, _d, _e, _f;
        if (error) {
            if (error.name == "TokenExpiredError") {
                return next(new error_1.RequestTimeoutError("Token expired!!!"));
            }
            else {
                return next(new error_1.UnauthorizedError("Invalid token. Authorization failed!"));
            }
        }
        // value 1 is for user
        if (decoded._id === 1 || (decoded === null || decoded === void 0 ? void 0 : decoded._id) === "user") {
            const user = yield index_schema_1.User.findById(decoded === null || decoded === void 0 ? void 0 : decoded.id, "+password");
            if (!user) {
                return next(new error_1.UnauthorizedError("Invalid User token."));
            }
            request.user = user;
            request.token = {
                type: "user",
                role: (_c = user === null || user === void 0 ? void 0 : user.role) !== null && _c !== void 0 ? _c : null,
                accessLevel: (_d = user === null || user === void 0 ? void 0 : user.accessLevel) !== null && _d !== void 0 ? _d : "user",
            };
        }
        // value 3 is for staff
        if (decoded._id === 3 || (decoded === null || decoded === void 0 ? void 0 : decoded._id) === "staff") {
            const staff = yield index_schema_1.Staff.findById(decoded === null || decoded === void 0 ? void 0 : decoded.id, "+password");
            if (!staff) {
                return next(new error_1.UnauthorizedError("Invalid Staff token."));
            }
            request.staff = staff;
            request.token = {
                type: "staff",
                role: (_e = staff === null || staff === void 0 ? void 0 : staff.role) !== null && _e !== void 0 ? _e : "staff",
                accessLevel: staff.accessLevel,
            };
        }
        // value 4 is for admin
        if (decoded._id === 4 || (decoded === null || decoded === void 0 ? void 0 : decoded._id) === "admin" || (decoded === null || decoded === void 0 ? void 0 : decoded._id) === "super-admin") {
            const admin = yield index_schema_1.Staff.findById(decoded === null || decoded === void 0 ? void 0 : decoded.id, "+password");
            if (!admin) {
                return next(new error_1.UnauthorizedError("Invalid Admin token."));
            }
            request.admin = admin;
            request.token = {
                type: "staff",
                role: (_f = admin === null || admin === void 0 ? void 0 : admin.role) !== null && _f !== void 0 ? _f : "admin",
                accessLevel: admin.accessLevel,
            };
        }
        return next();
    }));
}));
const accessLevelPermit = (...permitted) => (request, response, next) => {
    if (request.token &&
        request.token.accessLevel &&
        permitted.indexOf(request.token.accessLevel) !== -1) {
        return next();
    }
    // this occur when the user accessLevel is not allowed
    // throw new ApplicationError(403, "Access denied. (ALP)");
};
exports.accessLevelPermit = accessLevelPermit;
const typePermit = (...permitted) => (request, response, next) => {
    if (request.token &&
        request.token.type &&
        permitted.indexOf(request.token.type) !== -1) {
        return next();
    }
    // this occur when the user is not actve or isActive field is false
    throw new error_1.ApplicationError(403, "Access denied. (TP)");
};
exports.typePermit = typePermit;
const rolePermit = (...permitted) => (request, response, next) => {
    if (request.token &&
        request.token.role &&
        permitted.indexOf(request.token.role) !== -1) {
        return next();
    }
    // this occur when the user doesn't have the permitted role
    // throw new ApplicationError(403, "Access denied. (RP)");
};
exports.rolePermit = rolePermit;
