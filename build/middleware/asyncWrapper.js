"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This method helps to catch any error related to any routes to avoid server breakdown error
 */
exports.default = (wrapFunction) => async (request, response, next) => {
    try {
        await wrapFunction(request, response, next);
    }
    catch (error) {
        return next(error);
    }
};
