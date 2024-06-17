"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDisputeTicketID = exports.getUniqueId = void 0;
const nanoid_1 = require("nanoid");
const getUniqueId = async (len = 8) => (0, nanoid_1.nanoid)(len); //=> "V1StGXR8_Z5jdHi6B-myT"
exports.getUniqueId = getUniqueId;
const generateDisputeTicketID = async (len = 6) => (0, nanoid_1.nanoid)(len); //=> "V2StGXR8_Z5jdHi6B-&7G"
exports.generateDisputeTicketID = generateDisputeTicketID;
