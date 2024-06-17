"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.droneService = void 0;
const index_schema_1 = require("../model/index.schema");
class DroneService {
    async registerDrone(droneData) {
        const drone = new index_schema_1.Drone(droneData);
        return await drone.save();
    }
    async loadDrone(droneId, medicationData) {
        const drone = await index_schema_1.Drone.findById(droneId);
        if (!drone)
            throw new Error('Drone not found');
        if (drone.batteryCapacity < 25)
            throw new Error('Drone battery too low');
        const medication = new index_schema_1.Medication(medicationData);
        await medication.save();
        drone.medications.push(medication._id);
        drone.state = "LOADED";
        await drone.save();
        return drone;
    }
    async getDroneMedications(droneId) {
        const drone = await index_schema_1.Drone.findById(droneId).populate('medications');
        if (!drone)
            throw new Error('Drone not found');
        return drone.medications;
    }
    async getAvailableDrones() {
        return await index_schema_1.Drone.find({ state: 'IDLE' });
    }
    async getDroneBatteryLevel(droneId) {
        const drone = await index_schema_1.Drone.findById(droneId);
        if (!drone)
            throw new Error('Drone not found');
        return drone.batteryCapacity;
    }
}
exports.droneService = new DroneService();
