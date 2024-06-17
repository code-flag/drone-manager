// import { MongoMemoryServer } from 'mongodb-memory-server';
// import mongoose, { ConnectOptions } from 'mongoose';

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
 

import mongoose, { ConnectOptions } from 'mongoose';
import { expect } from 'chai';
import { MongoMemoryServer } from 'mongodb-memory-server';

mongoose.set("strictQuery", true);

describe('Minimal Test Suite', function () {
  // allow enough time for db server setup;
  this.timeout(20000);
  let mongoServer: MongoMemoryServer;

  before(async function () {
    mongoServer = await MongoMemoryServer.create();
    const uri = await mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions, (err: any) => {
      if (err) {
        console.log("error could not connect to database \n", err?.message);
      } else {
        console.log("Database successfully connected");
      }
    });
  });

  after(async function () {
    this.timeout(5000); // allow enough time for tear down
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  require("./battery-check.test.ts");
});
