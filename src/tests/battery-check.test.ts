import { expect } from 'chai';
import { Drone } from '../model/index.schema';
import sinon from 'sinon';
import {checkBatteryLevels} from '../config/cronJob';


describe('Battery Check Task', function () {
  this.timeout(20000);
  before(async function () {

    await Drone.deleteMany({});
    await Drone.create([
      { serialNumber: '1234', model: 'Lightweight', weightLimit: 100, batteryCapacity: 80, state: 'IDLE', medications: [] },
      { serialNumber: '5678', model: 'Heavyweight', weightLimit: 500, batteryCapacity: 20, state: 'IDLE', medications: [] }
    ]);
  });

  after(async function () {
    await Drone.deleteMany({});
  });

  it('should log battery levels for all drones', async () => {
    const logStub = sinon.stub(console, 'log');

    await checkBatteryLevels();

    expect(logStub.calledWithMatch(/Drone 1234 battery level: 80%/)).to.be.true;
    expect(logStub.calledWithMatch(/Drone 5678 battery level: 20%/)).to.be.true;

    logStub.restore();
  });
});
