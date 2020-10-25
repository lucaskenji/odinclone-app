const express = require('express');
const app = express();
const api = require('../routes/api.js');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

app.use(express.json());
app.use('/', api);

const startDatabase = async () => {
  mongoServer = new MongoMemoryServer();

  const connectionString = await mongoServer.getUri();
  
  try {
    await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (err) {
    console.log('Mongo connection error:', err);
  }
}

const destroyDatabase = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
}

module.exports = {
  startDatabase,
  destroyDatabase,
  app
}