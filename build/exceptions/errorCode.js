"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyerDeposit = exports.payout = void 0;
var payout;
(function (payout) {
    payout["PAYOUT_DECLINED"] = "P-100";
    payout[payout["PAYOUT_ABORTED"] = 200] = "PAYOUT_ABORTED";
    payout[payout["PAYOUT_NOT_STARTING"] = 300] = "PAYOUT_NOT_STARTING";
})(payout || (exports.payout = payout = {}));
var buyerDeposit;
(function (buyerDeposit) {
    buyerDeposit[buyerDeposit["INITIALIZE_PAYSTACK_FAIL"] = 100] = "INITIALIZE_PAYSTACK_FAIL";
    buyerDeposit[buyerDeposit["USER_ACCOUNT_VERIFICATION_FAIL"] = 200] = "USER_ACCOUNT_VERIFICATION_FAIL";
    buyerDeposit[buyerDeposit["CHARGE_DECLINED"] = 300] = "CHARGE_DECLINED";
})(buyerDeposit || (exports.buyerDeposit = buyerDeposit = {}));
