"use strict";
/**
 * @author Francis Olawumi Awe <awefrancolaz@gmail.com>
 * This action type is used to describe the action level
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionLevel = void 0;
var actionLevel;
(function (actionLevel) {
    actionLevel[actionLevel["DELETE"] = 1] = "DELETE";
    actionLevel[actionLevel["REMOVE"] = 2] = "REMOVE";
    actionLevel[actionLevel["UPDATE"] = 3] = "UPDATE";
    actionLevel[actionLevel["CREATE"] = 4] = "CREATE";
    actionLevel[actionLevel["LOGIN"] = 5] = "LOGIN";
})(actionLevel || (exports.actionLevel = actionLevel = {}));
