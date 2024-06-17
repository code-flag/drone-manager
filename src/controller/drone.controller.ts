import { Request, Response } from 'express';
import { droneService } from '../service/drone.service';
import { BadRequestError } from '../exceptions/error';
import { returnMsg } from '../helper/message-handler';

/**
 * @class - DroneController
 * This class implement all the method to run drone service
 */
class DroneController {
  async registerDrone(req: Request, res: Response) {
    try {
      const drone = await droneService.registerDrone(req.body);
      returnMsg(res, drone, "drone registered successfully");
    } catch (err: any) {
      throw new BadRequestError(err.message)
    }
  }

  async loadDrone(req: Request, res: Response) {
    try {
      const droneId = req.params.droneId;
      const medication = await droneService.loadDrone(droneId, req.body);
      returnMsg(res, medication, "drone loaded successfully");
    } catch (err: any) {
      throw new BadRequestError(err.message);
    }
  }

  async getDroneMedications(req: Request, res: Response) {
    try {
      const droneId = req.params.droneId;
      const medications = await droneService.getDroneMedications(droneId);
      returnMsg(res, medications, "drone medications retrieved successfully");
    } catch (err: any) {
      throw new BadRequestError(err.message);
    }
  }

  async getAvailableDrones(req: Request, res: Response) {
    try {
      const drones = await droneService.getAvailableDrones();
     
      returnMsg(res, drones, "Available drones retrieved successfully");
    } catch (err: any) {
      throw new BadRequestError(err.message);
    }
  }

  async getDroneBatteryLevel(req: Request, res: Response) {
    try {
      const droneId = req.params.droneId;
      const batteryLevel = await droneService.getDroneBatteryLevel(droneId);
     
      returnMsg(res, batteryLevel, "Drone battery level retrieved successfully");
    } catch (err: any) {
      throw new BadRequestError(err.message);
    }
  }
}

export const droneController = new DroneController();
