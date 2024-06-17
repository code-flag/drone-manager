"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncWrapper_1 = __importDefault(require("../middleware/asyncWrapper"));
const drone_controller_1 = require("../controller/drone.controller");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/drone/register', (0, asyncWrapper_1.default)(drone_controller_1.droneController.registerDrone));
router.post('/drone/load/:droneId', (0, asyncWrapper_1.default)(drone_controller_1.droneController.loadDrone));
router.get('/drone/medications/:droneId', (0, asyncWrapper_1.default)(drone_controller_1.droneController.getDroneMedications));
router.get('/drone/available', (0, asyncWrapper_1.default)(drone_controller_1.droneController.getAvailableDrones));
router.get('/drone/battery/:droneId', (0, asyncWrapper_1.default)(drone_controller_1.droneController.getDroneBatteryLevel));
exports.default = router;
