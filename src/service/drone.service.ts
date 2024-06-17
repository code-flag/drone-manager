import { Drone, Medication } from "../model/index.schema";


class DroneService {
  async registerDrone(droneData: any) {
    const drone = new Drone(droneData);
    return await drone.save();
  }

  async loadDrone(droneId: string, medicationData: any) {
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

  async getDroneMedications(droneId: string) {
    const drone = await Drone.findById(droneId).populate('medications');
    if (!drone) throw new Error('Drone not found');

    return drone.medications;
  }

  async getAvailableDrones() {
    return await Drone.find({ state: 'IDLE' });
  }

  async getDroneBatteryLevel(droneId: string) {
    const drone = await Drone.findById(droneId);
    if (!drone) throw new Error('Drone not found');

    return drone.batteryCapacity;
  }
}

export const droneService = new DroneService();
