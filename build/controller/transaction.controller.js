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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransactionStatus = exports.filterTransactions = exports.addTransaction = void 0;
const error_1 = require("../helper/error");
const message_handler_1 = require("../helper/message-handler");
const index_schema_1 = require("../model/index.schema");
// import { getUserAddedPerMonth } from "../helper/library";
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pkid = (_a = process.env.PAYMENT_PRIVATE_KEY) !== null && _a !== void 0 ? _a : "";
const stripe = require('stripe')(pkid);
const addTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, userId, items, shippingAddress } = req.body;
    if (!userId || !items || !amount) {
        throw new error_1.BadRequestError("User Id, items, and amount are required");
    }
    const userData = yield index_schema_1.User.findOne({ _id: userId });
    if (!userData) {
        throw new error_1.BadRequestError("User not found");
    }
    const txnData = {
        amount: amount,
        userId: userId,
        itemId: items,
        fullName: `${userData.firstName} ${userData.lastName}`,
        narration: "payment for products"
    };
    const savedTxnData = yield index_schema_1.Transactions.create(txnData);
    if (!savedTxnData) {
        throw new error_1.BadRequestError("Transaction failed. Please try again");
    }
    const domain = "https://market-place-orcin.vercel.app/Home";
    const session = yield stripe.checkout.sessions.create({
        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "array of product"
                    },
                    // price in cent
                    unit_amount: amount * 100
                },
                quantity: items.length,
            },
        ],
        payment_method_types: ["card"],
        mode: 'payment',
        customer_email: userData.email,
        client_reference_id: savedTxnData._id,
        metadata: {
            items: items.join(" "),
            userId: userData._id,
            narration: "payment for products",
        },
        success_url: `${domain}/success/${savedTxnData._id}`,
        cancel_url: `${domain}/cancel/${savedTxnData._id}`,
    });
    let updatedTxnData = {};
    if (session) {
        yield index_schema_1.Transactions.findOneAndUpdate({ _id: savedTxnData._id }, { $set: { reference: session.id }, }, { new: true });
        updatedTxnData["data"] = yield index_schema_1.Transactions.findOne({ _id: savedTxnData._id });
    }
    const orderData = yield Promise.all(items.map((productId) => __awaiter(void 0, void 0, void 0, function* () {
        const prd = yield index_schema_1.Product.findOne({ _id: productId });
        return {
            userId: userId,
            productId: productId,
            price: prd.basePrice,
            // price: prd.discountPrice,
            paymentId: savedTxnData._id,
            shippingAddress: shippingAddress,
            quantity: 1,
            isTracking: false
        };
    })));
    // save order data 
    console.log("orderData ", orderData);
    yield index_schema_1.Order.insertMany(orderData);
    updatedTxnData["paymentUrl"] = session.url;
    (0, message_handler_1.returnMsg)(res, updatedTxnData, "Transaction initiated successfully.");
});
exports.addTransaction = addTransaction;
const filterTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, offset = 0, 
    //   isActive = true,
    search, status, userId, orderId, transactionId, referenceId, category, fromDate, toDate, } = req.query;
    const matchQuery = {};
    if (status) {
        matchQuery["status"] = status;
    }
    if (userId) {
        matchQuery["userId"] = userId;
    }
    if (orderId) {
        matchQuery["orderId"] = orderId;
    }
    if (category) {
        matchQuery["OrderCategory"] = category;
    }
    if (transactionId) {
        matchQuery["_id"] = transactionId;
    }
    if (referenceId) {
        matchQuery["reference"] = referenceId;
    }
    if (search) {
        matchQuery["$or"] = [
            { regNo: { $regex: search, $options: "i" } },
            { fullName: { $regex: search, $options: "i" } },
            { reference: { $regex: search, $options: "i" } },
            { naration: { $regex: search, $options: "i" } },
            { OrganizationCategory: { $regex: search, $options: "i" } },
            { userId: { $regex: search, $options: "i" } },
            { orderId: { $regex: search, $options: "i" } },
            { reference: { $regex: search, $options: "i" } },
        ];
    }
    /** this help us to search student by date created or registered */
    if (fromDate && toDate) {
        matchQuery["createdAt"] = {
            $gte: new Date(`${fromDate}`).toISOString(),
            $lt: new Date(`${toDate}`).toISOString(),
        };
    }
    index_schema_1.Transactions.paginate(matchQuery, {
        populate: [
            {
                path: "orderId",
                select: "name logo tradename legalName industry category organizationCode isApproved",
            },
        ],
        limit: limit,
        offset: offset,
        sort: {
            createdAt: -1,
            _id: 1
        },
    }).then((txn) => {
        (0, message_handler_1.returnMsg)(res, {
            result: txn.docs,
            totalCount: txn.totalDocs,
        }, "Transactions retrieved successfully");
    });
});
exports.filterTransactions = filterTransactions;
const updateTransactionStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { staff, admin } = req;
    const { id } = req.params;
    const txn = yield index_schema_1.Transactions.find({ _id: id });
    if (!txn) {
        throw new error_1.NotFoundError("Transaction does not exist");
    }
    const result = yield index_schema_1.Transactions.findOneAndUpdate({ _id: id }, {
        $set: { status: req.body.status },
    }, { new: true });
    if (result && staff) {
        const staffData = {
            staffId: staff._id,
            desc: "update user transaction",
            actionLevel: "2",
        };
        yield index_schema_1.Transactions.findOneAndUpdate({ _id: id }, {
            $addToSet: { update: staffData },
        }, { new: true });
    }
    (0, message_handler_1.returnMsg)(res, result, "Transactions status updated successfully");
});
exports.updateTransactionStatus = updateTransactionStatus;
