import { Drone } from '../model/index.schema';
import cron from 'node-cron';


export const checkBatteryLevels = async () => {
  const drones = await Drone.find({});
  drones.forEach(async (drone) => {
    console.log(`Drone ${drone.serialNumber} battery level: ${drone.batteryCapacity}%`);
    // Save audit log here or trigger any actions needed
  });
};

// Schedule the battery check every hour
cron.schedule('0 * * * *', () => {
  console.log('Running battery check');
  checkBatteryLevels();
});

// Cron job set to run every 1 hour
export const BatteryLevelsScheduler = cron.schedule('*/15 * * * *', async () => {
  try {
    checkBatteryLevels();
  } catch (error) {
    console.error('Error in cron job:', error);
  }
}, {
  scheduled: true,
  timezone: "Africa/Lagos",
});

