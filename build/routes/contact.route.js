"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncWrapper_1 = __importDefault(require("../middleware/asyncWrapper"));
const contact_controller_1 = require("../controller/contact.controller");
const router = (0, express_1.Router)();
router.post("/create", (0, asyncWrapper_1.default)(contact_controller_1.addContact));
router.get("/all", (0, asyncWrapper_1.default)(contact_controller_1.getOneContact));
router.get("/:contactId", (0, asyncWrapper_1.default)(contact_controller_1.getManyContact));
router.get("/ticketId/:ticketId", (0, asyncWrapper_1.default)(contact_controller_1.getContactByTicketId));
router.get("/email/:email", (0, asyncWrapper_1.default)(contact_controller_1.getContactByEmail));
router.delete("/delete/:contactId", (0, asyncWrapper_1.default)(contact_controller_1.deleteContact));
exports.default = router;
