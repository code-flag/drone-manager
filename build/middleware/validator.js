"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const error_1 = require("../exceptions/error");
exports.default = (schemas, status = 400) => {
    const validationCheck = async (request, _, next) => {
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
    };
    return [...(schemas.length && [schemas]), validationCheck];
};
