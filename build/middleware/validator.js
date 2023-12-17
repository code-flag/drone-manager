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
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const error_1 = require("../helper/error");
exports.default = (schemas, status = 400) => {
    const validationCheck = (request, _, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(request);
        request = Object.assign(Object.assign({}, request), (0, express_validator_1.matchedData)(request));
        if (!errors.isEmpty()) {
            const mappedErrors = Object.entries(errors.mapped()).reduce((accumulator, [key, value]) => {
                accumulator[key] = value.msg;
                return accumulator;
            }, {});
            const validationErrors = new error_1.ApplicationError(status, "Invalid Credentials", mappedErrors);
            return next(validationErrors);
        }
        return next();
    });
    return [...(schemas.length && [schemas]), validationCheck];
};
