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
exports.generateDisputeTicketID = exports.getUniqueId = void 0;
const nanoid_1 = require("nanoid");
const getUniqueId = (len = 8) => __awaiter(void 0, void 0, void 0, function* () { return (0, nanoid_1.nanoid)(len); }); //=> "V1StGXR8_Z5jdHi6B-myT"
exports.getUniqueId = getUniqueId;
const generateDisputeTicketID = (len = 6) => __awaiter(void 0, void 0, void 0, function* () { return (0, nanoid_1.nanoid)(len); }); //=> "V2StGXR8_Z5jdHi6B-&7G"
exports.generateDisputeTicketID = generateDisputeTicketID;
