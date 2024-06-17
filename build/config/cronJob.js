"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatteryLevelsScheduler = exports.checkBatteryLevels = void 0;
const index_schema_1 = require("../model/index.schema");
const node_cron_1 = __importDefault(require("node-cron"));
const checkBatteryLevels = async () => {
    const drones = await index_schema_1.Drone.find({});
    drones.forEach(async (drone) => {
        console.log(`Drone ${drone.serialNumber} battery level: ${drone.batteryCapacity}%`);
        // Save audit log here or trigger any actions needed
    });
};
exports.checkBatteryLevels = checkBatteryLevels;
// Schedule the battery check every hour
node_cron_1.default.schedule('0 * * * *', () => {
    console.log('Running battery check');
    (0, exports.checkBatteryLevels)();
});
// Cron job set to run every 1 hour
exports.BatteryLevelsScheduler = node_cron_1.default.schedule('*/15 * * * *', async () => {
    try {
        (0, exports.checkBatteryLevels)();
    }
    catch (error) {
        console.error('Error in cron job:', error);
    }
}, {
    scheduled: true,
    timezone: "Africa/Lagos",
});
