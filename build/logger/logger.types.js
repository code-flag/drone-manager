"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logLevel = exports.logSeverity = exports.logTypes = void 0;
var logTypes;
(function (logTypes) {
    logTypes["SYSTEM"] = "system";
    logTypes["THREAT"] = "threat";
    logTypes["TRAFFIC"] = "traffic";
    logTypes["CONFIG"] = "config";
})(logTypes || (exports.logTypes = logTypes = {}));
var logSeverity;
(function (logSeverity) {
    logSeverity["EMERGENCY"] = "emergency";
    logSeverity["ALERT"] = "alert";
    logSeverity["CRITICAL"] = "critical";
    logSeverity["ERROR"] = "error";
    logSeverity["WARNING"] = "warning";
    logSeverity["NOTICE"] = "notice";
    logSeverity["INFO"] = "info";
    logSeverity["DEBUG"] = "debug";
    logSeverity["TRACE"] = "trace";
})(logSeverity || (exports.logSeverity = logSeverity = {}));
var logLevel;
(function (logLevel) {
    logLevel[logLevel["EMERGENCY"] = 0] = "EMERGENCY";
    logLevel[logLevel["ALERT"] = 1] = "ALERT";
    logLevel[logLevel["CRITICAL"] = 2] = "CRITICAL";
    logLevel[logLevel["ERROR"] = 3] = "ERROR";
    logLevel[logLevel["WARNING"] = 4] = "WARNING";
    logLevel[logLevel["NOTICE"] = 5] = "NOTICE";
    logLevel[logLevel["INFO"] = 6] = "INFO";
    logLevel[logLevel["DEBUG"] = 7] = "DEBUG";
    logLevel[logLevel["TRACE"] = 8] = "TRACE";
})(logLevel || (exports.logLevel = logLevel = {}));
