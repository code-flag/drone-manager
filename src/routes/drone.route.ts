import asyncWrapper from '../middleware/asyncWrapper';
import { droneController } from '../controller/drone.controller';
import express from 'express';

const router = express.Router();

router.post('/drone/register', asyncWrapper(droneController.registerDrone));
router.post('/drone/load/:droneId', asyncWrapper(droneController.loadDrone));
router.get('/drone/medications/:droneId', asyncWrapper(droneController.getDroneMedications));
router.get('/drone/available', asyncWrapper(droneController.getAvailableDrones));
router.get('/drone/battery/:droneId', asyncWrapper(droneController.getDroneBatteryLevel));

export default router;
