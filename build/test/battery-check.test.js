"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_schema_1 = require("../model/index.schema");
const sinon_1 = __importDefault(require("sinon"));
const cronJob_1 = __importDefault(require("../config/cronJob"));
describe('Battery Check Task', () => {
    before(async function () {
        this.timeout(10000);
        await index_schema_1.Drone.deleteMany({});
        await index_schema_1.Drone.create([
            { serialNumber: '1234', model: 'Lightweight', weightLimit: 100, batteryCapacity: 80, state: 'IDLE', medications: [] },
            { serialNumber: '5678', model: 'Heavyweight', weightLimit: 500, batteryCapacity: 20, state: 'IDLE', medications: [] }
        ]);
    });
    after(async function () {
        this.timeout(5000);
        await index_schema_1.Drone.deleteMany({});
    });
    it('should log battery levels for all drones', async () => {
        const logStub = sinon_1.default.stub(console, 'log');
        await (0, cronJob_1.default)();
        (0, chai_1.expect)(logStub.calledWithMatch(/Drone 1234 battery level: 80%/)).to.be.true;
        (0, chai_1.expect)(logStub.calledWithMatch(/Drone 5678 battery level: 20%/)).to.be.true;
        logStub.restore();
    });
});
