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
exports.deleteContact = exports.getOneContact = exports.getManyContact = exports.addContact = void 0;
const error_1 = require("../helper/error");
const message_handler_1 = require("../helper/message-handler");
const index_schema_1 = require("../model/index.schema");
const addContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const saveContact = yield index_schema_1.Contact.create(data);
    if (!saveContact) {
        throw new error_1.BadRequestError("Something went wrong, could not save Contact");
    }
    (0, message_handler_1.returnMsg)(res, saveContact, "Contact added successfully");
});
exports.addContact = addContact;
const getManyContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, offset = 0, fromDate, toDate } = req.query;
    const queries = [
        "ticketId",
        "name",
        "email",
        "subject",
        "contactType",
        "isRead",
        "phone",
        "search",
        "contactId"
    ];
    const matchQuery = {};
    /** search dispute by date created */
    if (fromDate && toDate) {
        matchQuery["createdAt"] = {
            $gte: new Date(`${fromDate}`).toISOString(),
            $lt: new Date(`${toDate}`).toISOString(),
        };
    }
    Object.keys(req.query).forEach((element) => {
        if (element === "contactId") {
            matchQuery["_id"] = req.query[element];
        }
        else if (element === "search") {
            matchQuery["$or"] = [
                { name: { $regex: req.query.search, $options: "i" } },
                { desc: { $regex: req.query.search, $options: "i" } },
            ];
        }
        else {
            if (queries.includes(element)) {
                matchQuery[element] = req.query[element];
            }
        }
    });
    index_schema_1.Contact.paginate(matchQuery, {
        populate: [],
        limit: limit,
        offset: offset,
        sort: {
            createdAt: -1,
            _id: 1,
        },
    }, (err, result) => {
        if (!err) {
            (0, message_handler_1.returnMsg)(res, {
                result: result.docs,
                totalCount: result.totalDocs,
            }, "Contact retrieved successfully");
        }
    });
});
exports.getManyContact = getManyContact;
const getOneContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contactId } = req.query;
    const findContact = yield index_schema_1.Contact.findOne({ _id: contactId });
    if (!findContact) {
        throw new error_1.NotFoundError("Contact not found");
    }
    (0, message_handler_1.returnMsg)(res, contactId, "Contact retrieved successfully");
});
exports.getOneContact = getOneContact;
const deleteContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contactId } = req.query;
    const findContact = yield index_schema_1.Contact.findOne({ _id: contactId });
    if (!findContact) {
        throw new error_1.NotFoundError("Contact not found");
    }
    const del = yield index_schema_1.Contact.findByIdAndDelete({ _id: contactId });
    (0, message_handler_1.returnMsg)(res, [], "Contact deleted successfully");
});
exports.deleteContact = deleteContact;
