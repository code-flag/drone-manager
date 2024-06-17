"use strict";
// import { MongoMemoryServer } from 'mongodb-memory-server';
// import mongoose, { ConnectOptions } from 'mongoose';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const mongod = new MongoMemoryServer();
// before(async () => {
//   const uri = await mongod.getUri();
//   console.log("uri for test ", test);
//   await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions);
// });
// after(async () => {
//   await mongoose.disconnect();
//   await mongod.stop();
// });
const mongoose_1 = __importDefault(require("mongoose"));
const chai_1 = require("chai");
const mongodb_memory_server_1 = require("mongodb-memory-server");
describe('Minimal Test Suite', () => {
    let mongoServer;
    before(async function () {
        // allow enough time for db server setup;
        this.timeout(10000);
        mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = await mongoServer.getUri();
        await mongoose_1.default.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
            if (err) {
                console.log("error could not connect to database \n", err === null || err === void 0 ? void 0 : err.message);
            }
            else {
                console.log("Database successfully connected");
            }
        });
    });
    after(async function () {
        this.timeout(5000);
        await mongoose_1.default.disconnect();
        await mongoServer.stop();
    });
    it('should connect to an in-memory database', async function () {
        const collections = await mongoose_1.default.connection.db.collections();
        (0, chai_1.expect)(collections).to.be.an('array');
    });
});
