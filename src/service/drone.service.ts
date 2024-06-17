import { IDrone } from "../model/schemas/drone.schema";
import { Drone, Medication } from "../model/index.schema";
import { IMedication } from "../model/schemas/medication.schema";

/**
 * @class DroneService - This service handles all the drone operation. It implements all the database operation
 */
class DroneService {
  /**
   * Drone registration method
   * @param {IDrone} droneData - drone date
   * @returns 
   */
  async registerDrone(droneData: IDrone) {
    const drone = new Drone(droneData);
    return await drone.save();
  }

  /**
   * Load drone data
   * @param droneId 
   * @param medicationData 
   * @returns 
   */
  async loadDrone(droneId: string, medicationData: IMedication) {
    const drone = await Drone.findById(droneId);
    if (!drone) throw new Error('Drone not found');

    if (drone.batteryCapacity < 25) throw new Error('Drone battery too low');

    const medication = new Medication(medicationData);
    await medication.save();

    drone.medications.push(medication._id);
    drone.state = "LOADED"
    await drone.save();

    return drone;
  }

  /**
   * Get drone medications
   * @param droneId 
   * @returns 
   */
  async getDroneMedications(droneId: string) {
    const drone = await Drone.findById(droneId).populate('medications');
    if (!drone) throw new Error('Drone not found');

    return drone.medications;
  }

  /**
   * Get all available drone
   * @returns 
   */
  async getAvailableDrones() {
    return await Drone.find({ state: 'IDLE' });
  }

  /**
   * Get drone battery level
   * @param droneId 
   * @returns 
   */
  async getDroneBatteryLevel(droneId: string) {
    const drone = await Drone.findById(droneId);
    if (!drone) throw new Error('Drone not found');

    return drone.batteryCapacity;
  }
}

export const droneService = new DroneService();
