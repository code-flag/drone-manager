"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.droneController = void 0;
const drone_service_1 = require("../service/drone.service");
const error_1 = require("../exceptions/error");
const message_handler_1 = require("../helper/message-handler");
class DroneController {
    async registerDrone(req, res) {
        try {
            const drone = await drone_service_1.droneService.registerDrone(req.body);
            (0, message_handler_1.returnMsg)(res, drone, "drone registered successfully");
        }
        catch (err) {
            throw new error_1.BadRequestError(err.message);
        }
    }
    async loadDrone(req, res) {
        try {
            const droneId = req.params.droneId;
            const medication = await drone_service_1.droneService.loadDrone(droneId, req.body);
            (0, message_handler_1.returnMsg)(res, medication, "drone loaded successfully");
        }
        catch (err) {
            throw new error_1.BadRequestError(err.message);
        }
    }
    async getDroneMedications(req, res) {
        try {
            const droneId = req.params.droneId;
            const medications = await drone_service_1.droneService.getDroneMedications(droneId);
            (0, message_handler_1.returnMsg)(res, medications, "drone medications retrieved successfully");
        }
        catch (err) {
            throw new error_1.BadRequestError(err.message);
        }
    }
    async getAvailableDrones(req, res) {
        try {
            const drones = await drone_service_1.droneService.getAvailableDrones();
            (0, message_handler_1.returnMsg)(res, drones, "Available drones retrieved successfully");
        }
        catch (err) {
            throw new error_1.BadRequestError(err.message);
        }
    }
    async getDroneBatteryLevel(req, res) {
        try {
            const droneId = req.params.droneId;
            const batteryLevel = await drone_service_1.droneService.getDroneBatteryLevel(droneId);
            (0, message_handler_1.returnMsg)(res, batteryLevel, "Drone battery level retrieved successfully");
        }
        catch (err) {
            throw new error_1.BadRequestError(err.message);
        }
    }
}
exports.droneController = new DroneController();