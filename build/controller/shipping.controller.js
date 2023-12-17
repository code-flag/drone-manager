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
exports.deleteShipping = exports.getOneShipping = exports.getManyShipping = exports.updateShipping = exports.addShipping = void 0;
const message_handler_1 = require("../helper/message-handler");
const index_schema_1 = require("../model/index.schema");
const addShipping = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const shipping = yield index_schema_1.Shipping.findOne({});
    (0, message_handler_1.returnMsg)(res, [], "addShipping");
});
exports.addShipping = addShipping;
const updateShipping = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, message_handler_1.returnMsg)(res, [], "addShipping");
});
exports.updateShipping = updateShipping;
const getManyShipping = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, message_handler_1.returnMsg)(res, [], "addShipping");
});
exports.getManyShipping = getManyShipping;
const getOneShipping = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, message_handler_1.returnMsg)(res, [], "addShipping");
});
exports.getOneShipping = getOneShipping;
const deleteShipping = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, message_handler_1.returnMsg)(res, [], "addShipping");
});
exports.deleteShipping = deleteShipping;
