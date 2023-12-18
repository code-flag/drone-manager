"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncWrapper_1 = __importDefault(require("../middleware/asyncWrapper"));
const dispute_controller_1 = require("../controller/dispute.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.default)();
router.post("/create", auth_1.verifyAccessKey, auth_1.verifyToken, (0, asyncWrapper_1.default)(dispute_controller_1.createDispute));
router.get("/all", auth_1.verifyAccessKey, auth_1.verifyToken, (0, asyncWrapper_1.default)(dispute_controller_1.getAllDisputes));
router.get("/ticketId/:disputeTicketId", auth_1.verifyAccessKey, auth_1.verifyToken, (0, asyncWrapper_1.default)(dispute_controller_1.getDisputeByTicketId));
router.get("/userId/:userId", auth_1.verifyAccessKey, auth_1.verifyToken, (0, asyncWrapper_1.default)(dispute_controller_1.getDisputeByUserId));
router.put("/resolve-dispute", auth_1.verifyAccessKey, auth_1.verifyToken, (0, asyncWrapper_1.default)(dispute_controller_1.adminResolution));
exports.default = router;
