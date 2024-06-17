"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drone = exports.Medication = void 0;
const medication_schema_1 = require("./schemas/medication.schema");
Object.defineProperty(exports, "Medication", { enumerable: true, get: function () { return medication_schema_1.Medication; } });
const drone_schema_1 = __importDefault(require("./schemas/drone.schema"));
exports.Drone = drone_schema_1.default;
